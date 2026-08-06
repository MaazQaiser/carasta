"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export function PasswordField({
  label = "Password",
  value,
  onChange,
  error,
  helperText,
  disabled,
  autoComplete = "current-password",
  placeholder,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      fullWidth
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
              edge="end"
              size="small"
              disabled={disabled}
            >
              {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
