
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubscription } from '@/context/SubscriptionContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  notificationType: z.enum(['all', 'selected']),
  selectedCountries: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample list of countries - in a real app, this would come from the API
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'India',
  'Japan', 'South Korea', 'China', 'Russia', 'South Africa'
];

export const SubscriptionForm = () => {
  const { addSubscription, loading } = useSubscription();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      notificationType: 'all',
      selectedCountries: [],
    },
  });

  const notificationType = form.watch('notificationType');

  const onSubmit = async (values: FormValues) => {
    await addSubscription(
      values.email, 
      values.notificationType === 'all' ? null : values.selectedCountries
    );
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="example@example.com" 
                        type="email" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notificationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Notification Preferences</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All countries</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected">Selected countries only</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {notificationType === 'selected' && (
              <FormField
                control={form.control}
                name="selectedCountries"
                render={() => (
                  <FormItem>
                    <FormLabel>Select countries</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                      {countries.map((country) => (
                        <FormField
                          key={country}
                          control={form.control}
                          name="selectedCountries"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={country}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(country)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, country])
                                        : field.onChange(
                                            current.filter((value) => value !== country)
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {country}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
