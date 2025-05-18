
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/context/SubscriptionContext';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

export const SubscriptionForm = () => {
  const { addSubscription, loading } = useSubscription();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    await addSubscription(values.email);
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Subscribe to Ransomware Alerts</h3>
      
      {submitted ? (
        <div className="text-center py-4">
          <p className="text-green-600 mb-2">Thanks for subscribing!</p>
          <p className="text-gray-600">Please check your email to verify your subscription.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Subscribe another email
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe to Updates'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              We'll send you alerts when new ransomware victims are detected.
              You can unsubscribe at any time.
            </p>
          </form>
        </Form>
      )}
    </div>
  );
};
