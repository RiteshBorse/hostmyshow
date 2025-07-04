import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const Confetti = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <svg width="200" height="200" viewBox="0 0 200 200">
      <g>
        <circle cx="50" cy="50" r="8" fill="#60a5fa">
          <animate attributeName="cy" values="50;150;50" dur="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="100" cy="50" r="8" fill="#f472b6">
          <animate attributeName="cy" values="50;140;50" dur="1.1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="50" r="8" fill="#34d399">
          <animate attributeName="cy" values="50;130;50" dur="1.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="75" cy="80" r="6" fill="#fbbf24">
          <animate attributeName="cy" values="80;160;80" dur="1.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="125" cy="80" r="6" fill="#a78bfa">
          <animate attributeName="cy" values="80;155;80" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  </div>
);

const SuccessCheck = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-8">
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" fill="#34d399" opacity="0.2" />
      <circle cx="40" cy="40" r="32" fill="#34d399" />
      <polyline points="28,42 38,52 54,30" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dasharray" from="0,60" to="60,0" dur="0.5s" fill="freeze" />
      </polyline>
    </svg>
    <h2 className="text-2xl font-bold text-green-500 animate-bounce">Congratulations!</h2>
    <p className="text-lg text-white">Your account is verified.</p>
  </div>
);

const Signup = () => {
  const [type, setType] = useState('Attendee');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setDialogOpen(true);
    setOtp('');
    setSuccess(false);
    setError('');
  };

  // Auto-verify OTP when 6 digits entered
  React.useEffect(() => {
    if (otp.length === 6) {
      handleOtpVerify(otp);
    }
  }, [otp]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setError('');
  };

  const handleOtpVerify = (value) => {
    setVerifying(true);
    setTimeout(() => {
      if (value === '123456') {
        setSuccess(true);
        setError('');
      } else {
        setError('Invalid OTP. Please try again.');
        setSuccess(false);
      }
      setVerifying(false);
    }, 700); // Simulate network delay
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setOtp('');
    setSuccess(false);
    setError('');
  };

  return (
    <div className='pt-12 px-24 mx-auto h-screen'>
        <div className='glass rounded-md p-8 flex flex-col h-1/2 justify-center items-center'>
            <h1 className='text-white text-3xl font-bold mb-4'>SignUp</h1>
            <form onSubmit={handleSignup} className='flex flex-col justify-center items-center gap-5 w-1/2'>
              <Input className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" placeholder="Email" required/>
              <Input className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" placeholder="Username" required/>
              <Input className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" placeholder="Password" type="password" required/>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full h-12 rounded-lg border-white/60 bg-transparent text-white text-lg px-3">
                <option value="Organizer">Organizer</option>
                <option value="Attendee">Attendee</option>
              </select>
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors shadow glow-blue w-1/2">Create Account</Button>
            </form>
            <div className="mt-4 text-white/80 text-sm">
              Already have an account? <Link to="/login" className="text-blue-300 hover:underline font-semibold">Log in</Link>
            </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OTP Verification</DialogTitle>
              <DialogDescription>
                OTP sent to your email. Please enter it below to verify your account.
              </DialogDescription>
            </DialogHeader>
            {success ? (
              <>
                <Confetti />
                <SuccessCheck />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 w-full">
                <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} className="mb-2" autoFocus disabled={verifying} >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={() => handleOtpVerify(otp)} disabled={otp.length !== 6 || verifying}>
                  {verifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default Signup
