import React from 'react';
import { AppBar, BottomNavigation, Paper, styled } from '@material-ui/core';
import {colors} from '../../util/settings';

let richColors = {
  primaryLight: '#2196F3',
  primaryMedium: 'rgba(25, 118, 210, 0.7)',
  primaryDark: 'rgba(42, 77, 105, 1)',
  accent: 'rgba(231, 239, 246, 1)',
  accentDark: 'rgba(173, 203, 227, 1)',
};

export let RichAppBar = styled(AppBar)({
  background: 'rgba(25, 118, 210, 0.7)',
  backdropFilter: colors.blur
});

export let RichBottomBar = styled(BottomNavigation)({
  background: 'rgba(25, 118, 210, 0.7)',
  backdropFilter: colors.blur
});

export let RichPaper = styled(Paper)({
  background: 'rgba(25, 118, 210, 0.7)',
  backdropFilter: colors.blur
});