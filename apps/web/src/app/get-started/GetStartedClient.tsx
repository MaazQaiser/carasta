"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CarastaLogo } from "@/components/brand/CarastaLogo";
import { useAuth } from "@/lib/context/auth-context";
import { brand } from "@/theme/carastaTheme";

export function GetStartedClient() {
  const router = useRouter();
  const { enterGuest } = useAuth();

  const browseAsGuest = () => {
    enterGuest();
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: `radial-gradient(1200px 500px at 50% -10%, ${brand.soft} 0%, transparent 60%), ${brand.canvas}`,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          alignItems: "center",
          textAlign: "center",
          bgcolor: "#fff",
          border: `1px solid ${brand.border}`,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 16px 48px -28px rgba(20,20,20,0.35)",
        }}
      >
        <CarastaLogo size={64} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: brand.ink, mb: 1 }}>
            Carasta
          </Typography>
          <Typography variant="body2" sx={{ color: brand.muted }}>
            Cars. Community. Culture. Bid, win, and connect with enthusiasts nationwide.
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ width: "100%" }}>
          <Button
            component={Link}
            href="/sign-up"
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            sx={{ py: 1.4, fontWeight: 700 }}
          >
            Sign Up
          </Button>
          <Button
            component={Link}
            href="/sign-in"
            fullWidth
            variant="outlined"
            size="large"
            sx={{ py: 1.3, fontWeight: 700 }}
          >
            Log In
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={browseAsGuest}
            sx={{ color: brand.muted, fontWeight: 600 }}
          >
            Browse as Guest
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
