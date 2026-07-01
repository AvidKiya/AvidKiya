"use client";

import React, { useState, useEffect } from 'react';

export const useAudio = () => {
  const playHover = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const playClick = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2571-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  return { playHover, playClick };
};
