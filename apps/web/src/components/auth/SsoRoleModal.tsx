"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { brand } from "@/theme/carastaTheme";

export type AccountType = "dealership" | "individual";

interface SsoRoleModalProps {
  open: boolean;
  onSelect: (type: AccountType) => void;
}

export function SsoRoleModal({ open, onSelect }: SsoRoleModalProps) {
  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Choose your account type</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: brand.muted, mb: 2.5 }}>
          Are you a dealership or an individual? We&apos;ll personalize Carasta for you.
        </Typography>
        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<StorefrontOutlinedIcon />}
            onClick={() => onSelect("dealership")}
            sx={{ justifyContent: "flex-start", py: 1.5 }}
          >
            I&apos;m a dealership
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<PersonOutlineIcon />}
            onClick={() => onSelect("individual")}
            sx={{ justifyContent: "flex-start", py: 1.5 }}
          >
            I&apos;m an individual
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
