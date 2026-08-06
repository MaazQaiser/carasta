"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { PASSWORD_RULES, isPasswordStrong } from "@/components/auth/passwordRules";
import { useAuth } from "@/lib/context/auth-context";
import { brand } from "@/theme/carastaTheme";

const COUNTRY_CODES = [
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+91", label: "IN +91" },
  { code: "+61", label: "AU +61" },
  { code: "+971", label: "AE +971" },
];

type GearStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function gearCopy(userType: string) {
  const isDealer = userType === "dealership";
  return [
    {
      icon: <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 40, color: brand.primary }} />,
      title: isDealer ? "Sell as a dealership" : "Join as an individual",
      body: isDealer
        ? "List inventory, run auctions, and reach enthusiasts who are ready to buy."
        : "Bid on enthusiast vehicles, build your garage, and connect with the Carmunity.",
    },
    {
      icon: <GavelOutlinedIcon sx={{ fontSize: 40, color: brand.primary }} />,
      title: "Live auctions, real stakes",
      body: "Follow countdown timers, place bids, and win cars with transparent bidding.",
    },
    {
      icon: <GroupsOutlinedIcon sx={{ fontSize: 40, color: brand.primary }} />,
      title: "Carmunity is built in",
      body: "Follow collectors, join clubs, and share builds — cars, community, and culture in one place.",
    },
    {
      icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 40, color: brand.primary }} />,
      title: "Stay ahead of the drop",
      body: "Get notified when auctions go live, when you’re outbid, and when listings match your taste.",
    },
    {
      icon: <SecurityOutlinedIcon sx={{ fontSize: 40, color: brand.primary }} />,
      title: "Secure your account",
      body: "Next we’ll verify your mobile number and set a password so your account stays protected.",
    },
  ] as const;
}

export function SignUpFlowClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, returnTo, setReturnTo } = useAuth();

  const userType = searchParams.get("type") === "dealership" ? "dealership" : "individual";
  const fromSso = searchParams.get("from") === "sso";

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) setReturnTo(redirect);
  }, [searchParams, setReturnTo]);

  const [step, setStep] = useState<GearStep>(fromSso ? 6 : 1);
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const gears = useMemo(() => gearCopy(userType), [userType]);
  const progress = ((step - 1) / 7) * 100;

  const titles: Record<GearStep, { title: string; subtitle?: string }> = {
    1: { title: gears[0].title, subtitle: gears[0].body },
    2: { title: gears[1].title, subtitle: gears[1].body },
    3: { title: gears[2].title, subtitle: gears[2].body },
    4: { title: gears[3].title, subtitle: gears[3].body },
    5: { title: gears[4].title, subtitle: gears[4].body },
    6: { title: "Verify your mobile", subtitle: "We'll send a one-time code to confirm it's you." },
    7: { title: "Enter OTP", subtitle: `Code sent to ${countryCode} ${phone}` },
    8: { title: "Create password", subtitle: "Choose a strong password for your Carasta account." },
  };

  const finish = () => {
    signIn("user-me");
    setToast("Account created");
    const redirect = returnTo || "/";
    setReturnTo(null);
    window.setTimeout(() => router.push(redirect), 700);
  };

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep(7);
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    setOtpError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    // Mock: 000000 fails
    if (code === "000000") {
      setOtpError("Invalid code. Please try again.");
      return;
    }
    setStep(8);
  };

  const createPassword = async () => {
    if (!isPasswordStrong(password)) return;
    if (password !== confirm) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    finish();
  };

  const onOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const shell = titles[step];

  return (
    <>
      <AuthShell title={shell.title} subtitle={shell.subtitle}>
        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: brand.muted, fontWeight: 600 }}>
              Step {step} of 8
            </Typography>
            <Typography variant="caption" sx={{ color: brand.muted, textTransform: "capitalize" }}>
              {userType}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 99,
              bgcolor: brand.soft,
              "& .MuiLinearProgress-bar": { bgcolor: brand.primary, borderRadius: 99 },
            }}
          />
        </Box>

        {step <= 5 && (() => {
          const gear = gears[step - 1]!;
          return (
          <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center", py: 1 }}>
            {gear.icon}
            <Typography variant="body2" sx={{ color: brand.inkSoft, maxWidth: 320 }}>
              {gear.body}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ width: "100%", pt: 1 }}>
              {step > 1 ? (
                <Button fullWidth variant="outlined" onClick={() => setStep((s) => (s - 1) as GearStep)}>
                  Back
                </Button>
              ) : (
                <Button fullWidth variant="outlined" component={Link} href="/sign-up">
                  Back
                </Button>
              )}
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setStep((s) => (s + 1) as GearStep)}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
          );
        })()}

        {step === 6 && (
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!phoneError}
              helperText={phoneError}
              placeholder="555 123 4567"
              inputProps={{ inputMode: "tel" }}
            />
            <Stack direction="row" spacing={1.5}>
              {fromSso ? (
                <Button fullWidth variant="outlined" component={Link} href="/sign-up">
                  Back
                </Button>
              ) : (
                <Button fullWidth variant="outlined" onClick={() => setStep(5)}>
                  Back
                </Button>
              )}
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Send OTP"}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 7 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
              {otp.map((digit, i) => (
                <TextField
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                  }}
                  error={!!otpError}
                  inputProps={{
                    maxLength: 1,
                    inputMode: "numeric",
                    style: { textAlign: "center", fontWeight: 700, fontSize: 18 },
                  }}
                  sx={{ width: 48 }}
                />
              ))}
            </Stack>
            {otpError && (
              <Typography variant="caption" sx={{ color: brand.primary, textAlign: "center" }}>
                {otpError}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: brand.muted, textAlign: "center", cursor: "pointer" }}
              onClick={sendOtp}
            >
              Resend code
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button fullWidth variant="outlined" onClick={() => setStep(6)}>
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 8 && (
          <Stack spacing={2}>
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm password"
              value={confirm}
              onChange={setConfirm}
              error={!!confirmError}
              helperText={confirmError}
              autoComplete="new-password"
            />
            <List dense disablePadding>
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(password);
                return (
                  <ListItem key={rule.id} disableGutters sx={{ py: 0.15 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      {ok ? (
                        <CheckCircleIcon sx={{ fontSize: 18, color: brand.success }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: brand.muted }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={rule.label}
                      primaryTypographyProps={{
                        variant: "caption",
                        sx: { color: ok ? brand.ink : brand.muted, fontWeight: ok ? 600 : 500 },
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Stack direction="row" spacing={1.5}>
              <Button fullWidth variant="outlined" onClick={() => setStep(7)}>
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={createPassword}
                disabled={loading || !isPasswordStrong(password)}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Create account"}
              </Button>
            </Stack>
          </Stack>
        )}
      </AuthShell>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}>
        <Alert severity="success" variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </>
  );
}
