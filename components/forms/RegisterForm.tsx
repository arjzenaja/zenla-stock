'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormValues } from '@/lib/validations'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Store, User as UserIcon, AtSign, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({ score: 0, label: '', color: '' })
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      storeName: '',
      ownerName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  })

  const password = form.watch('password')

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' })
      return
    }

    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const levels = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-brand' },
    ]

    setPasswordStrength({
      score,
      label: levels[score - 1]?.label || 'Weak',
      color: levels[score - 1]?.color || 'bg-red-500',
    })
  }, [password])

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Registration failed')
      }

      toast.success('Account created successfully!')
      
      // Auto login after successful registration
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: '/',
      })
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Store Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="e.g. Zenla Organics" 
                    className="pl-10 h-12 bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand focus-visible:border-brand rounded-xl"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Owner Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="e.g. Alex Rivera" 
                    className="pl-10 h-12 bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand focus-visible:border-brand rounded-xl"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="alex@example.com" 
                    className="pl-10 h-12 bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand focus-visible:border-brand rounded-xl"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-widest text-slate-500 uppercase">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters" 
                    className="pl-10 pr-10 h-12 bg-[#F5FAF7] border-[#C8E6D4] focus-visible:ring-brand focus-visible:border-brand rounded-xl"
                    {...field} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormControl>
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strength: {passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`} 
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1">
              <div className="flex items-start gap-3 mt-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="mt-1 border-brand data-[state=checked]:bg-brand"
                  />
                </FormControl>
                <FormLabel className="text-sm text-slate-500 font-normal leading-tight cursor-pointer">
                  I agree to the <a href="#" className="text-brand font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-brand font-bold hover:underline">Privacy Policy</a>
                </FormLabel>
              </div>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-brand hover:bg-brand-light text-white font-bold rounded-xl shadow-lg shadow-brand/20 active:scale-[0.98] transition-all mt-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>CREATING ACCOUNT...</span>
            </div>
          ) : (
            <span>CREATE ACCOUNT</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
