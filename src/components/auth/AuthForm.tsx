
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, signUp, forgotPassword } from '@/lib/auth';

type FormType = 'signIn' | 'signUp' | 'forgotPassword';

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } else {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signUp({ 
      username, email, password, mobile, companyName, companyAddress 
    });
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Sign Up Successful!", description: "You are now logged in. Redirecting..." });
      router.push('/admin/dashboard');
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
                <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
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
            <div className="space-y-2">
              <Label htmlFor="password-signin">Password</Label>
              <Input id="password-signin" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
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

  return (
    <Card className="w-full max-w-lg paper-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl">
          {formType === 'signIn' && 'Welcome Back!'}
          {formType === 'signUp' && 'Create Your Account'}
          {formType === 'forgotPassword' && 'Reset Your Password'}
        </CardTitle>
        <CardDescription>
          {formType === 'signIn' && 'Sign in to access your dashboard.'}
          {formType === 'signUp' && 'Fill out the form below to get started.'}
          {formType === 'forgotPassword' && 'Enter your email to receive a reset link.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        <AnimatePresence mode="wait">
          {renderForm()}
        </AnimatePresence>
      </CardContent>
      {formType === 'forgotPassword' && (
        <CardFooter>
          <Button variant="link" className="w-full" onClick={() => setFormType('signIn')}>Back to Sign In</Button>
        </CardFooter>
      )}
    </Card>
  );
}
