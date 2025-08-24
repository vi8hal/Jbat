
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, signUp, forgotPassword } from '@/lib/auth';
import { saveAuth } from '@/lib/auth-client';
import type { User } from '@/lib/types';


type FormType = 'signIn' | 'signUp' | 'forgotPassword' | 'otp';

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function AuthForm() {
  const [formType, setFormType] = useState<FormType>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Form fields state
  const [identifier, setIdentifier] = useState(''); // for username or email
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUser, setTempUser] = useState<Omit<User, 'hashedPassword' | 'password'> | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);

    if (result.success && result.user) {
      toast({ title: "OTP Required", description: "An OTP has been sent to your email (for demo, use 123456)." });
      setTempUser(result.user);
      setFormType('otp');
    } else {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, you'd send the OTP to the server for verification.
    // Here we simulate it.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (otp === '123456' && tempUser) {
        // Here, the server would return a JWT after successful OTP verification.
        // We'll simulate that by generating the token on the server via another action.
        const token = "simulated_jwt_for_" + tempUser.username; // In a real app, this comes from server
        saveAuth(token, tempUser);
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        router.push('/admin/dashboard');
    } else {
        toast({ title: "Verification Failed", description: "Invalid OTP. Please try again.", variant: "destructive" });
    }
    setIsLoading(false);
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signUp({ 
      username, email, password, mobile, companyName, companyAddress 
    });
    setIsLoading(false);

    if (result.success && result.user) {
      toast({ title: "Sign Up Successful!", description: "Please sign in to continue." });
      setFormType('signIn');
    } else {
      toast({ title: "Sign Up Failed", description: result.message, variant: "destructive" });
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await forgotPassword(email);
    setIsLoading(false);
    toast({ title: "Request Sent", description: result.message });
    if(result.success) {
      setFormType('signIn');
    }
  };

  const renderForm = () => {
    switch (formType) {
      case 'otp':
        return (
          <motion.form key="otp" onSubmit={handleOtpVerification} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input id="otp" type="text" placeholder="Enter your OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Sign In
            </Button>
          </motion.form>
        );
      case 'signUp':
        return (
          <motion.form key="signUp" onSubmit={handleSignUp} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username-signup">Username</Label>
                <Input id="username-signup" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email Address</Label>
                <Input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile-signup">Mobile Number</Label>
                    <Input id="mobile-signup" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required disabled={isLoading} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Input id="company-address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required disabled={isLoading} />
            </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
             </Button>
          </motion.form>
        );
      case 'forgotPassword':
        return (
          <motion.form key="forgotPassword" onSubmit={handleForgotPassword} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-forgot">Email Address</Label>
              <Input id="email-forgot" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </motion.form>
        );
      case 'signIn':
      default:
        return (
          <motion.form key="signIn" onSubmit={handleSignIn} variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="password-signin">Password</Label>
              <Input id="password-signin" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="pr-10"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right">
                <Button variant="link" size="sm" className="p-0 h-auto" type="button" onClick={() => { setEmail(identifier); setFormType('forgotPassword');}}>
                    Forgot Password?
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </motion.form>
        );
    }
  };

  const getTitle = () => {
    switch(formType) {
        case 'signIn': return 'Welcome Back!';
        case 'signUp': return 'Create Your Account';
        case 'forgotPassword': return 'Reset Your Password';
        case 'otp': return 'Two-Factor Authentication';
    }
  }

  const getDescription = () => {
    switch(formType) {
        case 'signIn': return 'Sign in to access your dashboard.';
        case 'signUp': return 'Fill out the form below to get started.';
        case 'forgotPassword': return 'Enter your email to receive a reset link.';
        case 'otp': return 'Enter the code sent to your email.';
    }
  }
  
  const getIcon = () => {
     switch(formType) {
        case 'otp': return <ShieldCheck className="w-8 h-8" />;
        default: return <KeyRound className="w-8 h-8" />;
     }
  }

  return (
    <Card className="w-full max-w-lg paper-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center mb-4">
            {getIcon()}
        </div>
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {formType !== 'otp' && (
          <div className="relative bg-muted p-1 rounded-full grid grid-cols-2 mb-6">
              <button onClick={() => setFormType('signIn')} className="relative z-10 p-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50" disabled={formType === 'signIn'}>Sign In</button>
              <button onClick={() => setFormType('signUp')} className="relative z-10 p-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50" disabled={formType === 'signUp'}>Sign Up</button>
              <motion.div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-full shadow-sm"
                  initial={false}
                  animate={{ x: formType === 'signIn' ? '0%' : '100%' }}
                  style={{ left: '2px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
          </div>
        )}
        <AnimatePresence mode="wait">
          {renderForm()}
        </AnimatePresence>
      </CardContent>
      {formType === 'forgotPassword' && (
        <CardFooter>
          <Button variant="link" className="w-full" onClick={() => setFormType('signIn')}>Back to Sign In</Button>
        </CardFooter>
      )}
      {formType === 'otp' && (
         <CardFooter>
          <Button variant="link" className="w-full" onClick={() => setFormType('signIn')}>Back to Sign In</Button>
        </CardFooter>
      )}
    </Card>
  );
}
