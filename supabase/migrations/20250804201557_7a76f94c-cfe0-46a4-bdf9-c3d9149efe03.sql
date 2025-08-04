-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'agent', 'user')),
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'active', 'at-risk', 'churned')),
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  growth_rate DECIMAL(5,2) DEFAULT 0,
  last_activity_date TIMESTAMPTZ,
  assigned_agent_id UUID REFERENCES auth.users(id),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS on customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create customers" 
ON public.customers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update customers" 
ON public.customers 
FOR UPDATE 
TO authenticated
USING (true);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task', 'milestone')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Authenticated users can view activities" 
ON public.activities 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create activities" 
ON public.activities 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update activities they created or are assigned to" 
ON public.activities 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Create AI insights table for storing Gemini AI analysis
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('health_analysis', 'recommendation', 'risk_assessment', 'opportunity')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on AI insights
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for AI insights
CREATE POLICY "Authenticated users can view AI insights" 
ON public.ai_insights 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create AI insights" 
ON public.ai_insights 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Create social shares table for Ayrshare integration
CREATE TABLE public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  share_status TEXT DEFAULT 'pending' CHECK (share_status IN ('pending', 'scheduled', 'posted', 'failed')),
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  ayrshare_post_id TEXT,
  response_data JSONB,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on social shares
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;

-- Create policies for social shares
CREATE POLICY "Authenticated users can view social shares" 
ON public.social_shares 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create social shares" 
ON public.social_shares 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_health_score ON public.customers(health_score);
CREATE INDEX idx_customers_assigned_agent ON public.customers(assigned_agent_id);
CREATE INDEX idx_activities_customer_id ON public.activities(customer_id);
CREATE INDEX idx_activities_type ON public.activities(type);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_activities_due_date ON public.activities(due_date);
CREATE INDEX idx_ai_insights_customer_id ON public.ai_insights(customer_id);
CREATE INDEX idx_ai_insights_type ON public.ai_insights(insight_type);