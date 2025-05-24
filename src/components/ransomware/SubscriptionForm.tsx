
import { useState } from 'react';
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
import { Mail, Shield, Clock, Globe } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Vui lòng nhập địa chỉ email hợp lệ' }),
  notificationType: z.enum(['all', 'selected']),
  selectedCountries: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Updated list of countries in Vietnamese
const countries = [
  'Hoa Kỳ', 'Anh', 'Canada', 'Úc', 'Đức', 'Pháp', 'Ý', 'Tây Ban Nha', 
  'Brazil', 'Ấn Độ', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Nga', 
  'Nam Phi', 'Việt Nam', 'Thái Lan', 'Malaysia', 'Singapore', 'Indonesia'
];

export const SubscriptionForm = () => {
  const { addSubscription, loading } = useSubscription();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  
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
    setSubmittedEmail(values.email);
    await addSubscription(
      values.email, 
      values.notificationType === 'all' ? null : values.selectedCountries
    );
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-red-600" />
        <h3 className="text-xl font-semibold">Đăng Ký Thông Báo Ransomware</h3>
      </div>
      
      {submitted ? (
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">Đăng Ký Thành Công!</h4>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã đăng ký dịch vụ cảnh báo ransomware của chúng tôi.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">Email xác nhận đã được gửi</p>
                <p className="text-sm text-blue-700">
                  Một email xác nhận đã được gửi đến <strong>{submittedEmail}</strong>. 
                  Bạn sẽ bắt đầu nhận thông báo khi có nạn nhân ransomware mới được phát hiện.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-amber-900 mb-1">Thông tin quan trọng</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Hệ thống kiểm tra nạn nhân mới mỗi 4 giờ</li>
                  <li>• Thông báo được gửi ngay khi phát hiện</li>
                  <li>• Bạn có thể hủy đăng ký bất cứ lúc nào</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSubmitted(false)}
          >
            Đăng ký email khác
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="example@company.com" 
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
                  <FormLabel className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Phạm Vi Thông Báo
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="cursor-pointer">
                          Tất cả quốc gia (Khuyến nghị)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected" className="cursor-pointer">
                          Chỉ quốc gia được chọn
                        </Label>
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
                    <FormLabel>Chọn quốc gia quan tâm</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border rounded-md bg-gray-50">
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
                                <FormLabel className="text-sm font-normal cursor-pointer">
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
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng Ký Nhận Thông Báo'}
            </Button>
            
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                ✓ Miễn phí và không yêu cầu xác thực email
              </p>
              <p>
                ✓ Thông báo ngay lập tức khi phát hiện nạn nhân mới
              </p>
              <p>
                ✓ Bạn có thể hủy đăng ký bất cứ lúc nào qua link trong email
              </p>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
