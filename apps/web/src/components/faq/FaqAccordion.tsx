"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { CARASTA_FAQ_CATEGORIES } from "@/lib/carasta-faqs";
import { brand } from "@/theme/carastaTheme";

export function FaqAccordion() {
  const [categoryId, setCategoryId] = useState(CARASTA_FAQ_CATEGORIES[0]!.id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    CARASTA_FAQ_CATEGORIES[0]!.items[0]?.question ?? null
  );
  const category = CARASTA_FAQ_CATEGORIES.find((item) => item.id === categoryId) ?? CARASTA_FAQ_CATEGORIES[0]!;

  return (
    <Box>
      <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: "wrap", mb: 3 }}>
        {CARASTA_FAQ_CATEGORIES.map((item) => {
          const selected = item.id === categoryId;
          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => {
                setCategoryId(item.id);
                setOpenQuestion(item.items[0]?.question ?? null);
              }}
              sx={{
                px: 2,
                py: 0.9,
                borderRadius: 999,
                border: `1px solid ${selected ? brand.ink : brand.border}`,
                bgcolor: selected ? brand.ink : "#fff",
                color: selected ? "#fff" : brand.ink,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {item.title}
            </Box>
          );
        })}
      </Stack>

      <Stack spacing={1.25}>
        {category.items.map((faq) => {
          const open = openQuestion === faq.question;
          return (
            <Box
              key={faq.question}
              sx={{
                border: `1px solid ${brand.border}`,
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: open ? brand.softer : "#fff",
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => setOpenQuestion(open ? null : faq.question)}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2.5,
                  py: 1.75,
                  textAlign: "left",
                  bgcolor: "transparent",
                  cursor: "pointer",
                }}
              >
                <Typography fontWeight={700} sx={{ fontSize: 15 }}>
                  {faq.question}
                </Typography>
                <ExpandMoreRoundedIcon
                  sx={{
                    color: brand.muted,
                    flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </Box>
              {open ? (
                <Box sx={{ px: 2.5, pb: 2.25 }}>
                  {faq.answer.map((paragraph) => (
                    <Typography
                      key={paragraph}
                      color="text.secondary"
                      sx={{ fontSize: 14, lineHeight: 1.7, mb: 1, "&:last-child": { mb: 0 } }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
