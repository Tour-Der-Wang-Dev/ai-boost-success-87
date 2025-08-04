import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AuthPage: React.FC = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInForm.email, signInForm.password);
      
      if (error) {
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: error.message === 'Invalid login credentials' 
            ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับสู่ CSM Pro",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน",
        variant: "destructive",
      });
      return;
    }

    if (signUpForm.password.length < 6) {
      toast({
        title: "รหัสผ่านสั้นเกินไป",
        description: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signUpForm.email, 
        signUpForm.password, 
        signUpForm.fullName
      );
      
      if (error) {
        toast({
          title: "สมัครสมาชิกไม่สำเร็จ",
          description: error.message === 'User already registered' 
            ? "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "สมัครสมาชิกสำเร็จ",
          description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-subtle">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CSM Pro</h1>
              <p className="text-white/80">Customer Success Management</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            จัดการลูกค้าได้อย่างมืออาชีพ
          </h2>
          
          <p className="text-white/90 mb-8 text-lg">
            ระบบ Customer Success Management ที่ช่วยให้คุณติดตามลูกค้า 
            วิเคราะห์ข้อมูลด้วย AI และสร้างความสำเร็จร่วมกัน
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white/90">การติดตามลูกค้าแบบเรียลไทม์</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white/90">AI Assistant ด้วย Gemini AI</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-white/90">การแชร์ข้อมูลโซเชียลมีเดีย</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">CSM Pro</h1>
            </div>
          </div>

          <Card className="bg-gradient-card shadow-elegant border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">
                ยินดีต้อนรับ
              </CardTitle>
              <p className="text-muted-foreground">
                เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเริ่มใช้งาน
              </p>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
                  <TabsTrigger value="signup">สมัครสมาชิก</TabsTrigger>
                </TabsList>
                
                {/* Sign In Form */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">อีเมล</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signInForm.email}
                          onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">รหัสผ่าน</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={signInForm.password}
                          onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      เข้าสู่ระบบ
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Sign Up Form */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">ชื่อ-นามสกุล</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="ชื่อ นามสกุล"
                          value={signUpForm.fullName}
                          onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">อีเมล</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">รหัสผ่าน</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="อย่างน้อย 6 ตัวอักษร"
                          value={signUpForm.password}
                          onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">ยืนยันรหัสผ่าน</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="ยืนยันรหัสผ่าน"
                          value={signUpForm.confirmPassword}
                          onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      สมัครสมาชิก
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              การสมัครสมาชิกแสดงว่าคุณยอมรับ{' '}
              <a href="#" className="text-primary hover:underline">เงื่อนไขการใช้งาน</a>
              {' '}และ{' '}
              <a href="#" className="text-primary hover:underline">นโยบายความเป็นส่วนตัว</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;