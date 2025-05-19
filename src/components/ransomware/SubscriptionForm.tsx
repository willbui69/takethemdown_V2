
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubscription } from '@/context/SubscriptionContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mail, ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced email validation with common security checks
const emailSchema = z.string()
  .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ' })
  .refine(email => email.length <= 255, { message: 'Email quá dài' })
  .refine(email => {
    // Prevent common script injection patterns
    return !/[<>]|\s*javascript\s*:/i.test(email) && !/^\s|\s$/.test(email);
  }, { message: 'Địa chỉ email chứa ký tự không hợp lệ' });

const formSchema = z.object({
  email: emailSchema,
  notificationType: z.enum(['all', 'selected']),
  selectedCountries: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample list of countries - in a real app, this would come from the API
const countries = [
  'Hoa Kỳ', 'Anh', 'Canada', 'Úc', 
  'Đức', 'Pháp', 'Ý', 'Tây Ban Nha', 'Brazil', 'Ấn Độ',
  'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Nga', 'Nam Phi', 'Việt Nam'
];

export const SubscriptionForm = () => {
  const { addSubscription, loading, getVerificationLink } = useSubscription();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [verificationLink, setVerificationLink] = useState<string | undefined>();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      notificationType: 'all',
      selectedCountries: [],
    },
  });

  const notificationType = form.watch('notificationType');
  
  // Anti-spam protection
  useEffect(() => {
    if (submitAttempts > 5) {
      const timeout = setTimeout(() => {
        setSubmissionError(null);
        setSubmitAttempts(0);
      }, 60000); // Reset after 1 minute
      
      return () => clearTimeout(timeout);
    }
  }, [submitAttempts]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmissionError(null);
      
      // Anti-spam check
      if (submitAttempts > 5) {
        setSubmissionError("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
        return;
      }
      
      setSubmitAttempts(prev => prev + 1);
      
      // Sanitize input
      const sanitizedEmail = values.email.trim().toLowerCase();
      setSubmittedEmail(sanitizedEmail);
      
      await addSubscription(
        sanitizedEmail, 
        values.notificationType === 'all' ? null : values.selectedCountries
      );
      
      setSubmitted(true);
      form.reset();
      
      // Give the subscription system time to update
      setTimeout(() => {
        const link = getVerificationLink(sanitizedEmail);
        setVerificationLink(link);
      }, 100);
    } catch (error) {
      console.error("Subscription error:", error);
      setSubmissionError("Không thể hoàn thành đăng ký. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Đăng Ký Thông Báo Mã độc tống tiền</h3>
      
      {submissionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}
      
      {submitted ? (
        <div className="text-center py-4">
          <p className="text-green-600 mb-2">Cảm ơn bạn đã đăng ký!</p>
          <p className="text-gray-600 mb-4">Vui lòng kiểm tra email của bạn để xác nhận đăng ký.</p>
          
          {verificationLink && (
            <Alert className="mb-4 bg-blue-50">
              <AlertDescription className="text-sm">
                <span className="font-semibold block mb-2">Chú ý: Đây là phiên bản demo</span>
                Trong ứng dụng thực tế, một email xác thực sẽ được gửi đến {submittedEmail}. Để mô phỏng việc xác thực, bạn có thể sử dụng liên kết dưới đây:
                <Button 
                  variant="link" 
                  className="flex items-center gap-1 mt-2 mx-auto text-blue-600"
                  onClick={() => window.open(verificationLink, "_blank")}
                >
                  Xác Thực Email <ExternalLink className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setSubmitted(false)}
          >
            Đăng ký email khác
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
                  <FormLabel>Địa chỉ email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="example@example.com" 
                        type="email" 
                        className="pl-10"
                        autoComplete="email"
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
                  <FormLabel>Tùy Chọn Thông Báo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">Tất cả quốc gia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected">Chỉ quốc gia đã chọn</Label>
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
                    <FormLabel>Chọn quốc gia</FormLabel>
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || submitAttempts > 5}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng Ký Nhận Thông Báo'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Chúng tôi sẽ gửi cho bạn thông báo khi phát hiện nạn nhân ransomware mới.
              Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </form>
        </Form>
      )}
    </div>
  );
};
