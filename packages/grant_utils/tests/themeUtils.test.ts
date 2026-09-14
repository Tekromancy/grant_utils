import { describe, it, expect } from 'vitest';
import { getTheme, AVAILABLE_THEMES } from '../src/index.js';

describe('themeUtils', () => {
  it('should include Obsidian OLED and Obsidian Vampire themes', () => {
    const oled = AVAILABLE_THEMES.find(t => t.id === 'obsidian-oled');
    expect(oled).toBeDefined();
    expect(oled?.background).toBe('#000000');
    expect(oled?.foreground).toBe('#FFFFFF');

    const vampire = AVAILABLE_THEMES.find(t => t.id === 'obsidian-vampire');
    expect(vampire).toBeDefined();
    expect(vampire?.background).toBe('#000000');
    expect(vampire?.foreground).toBe('#882233');
  });

  it('should resolve themes by ID with fallback to first theme', () => {
    const slate = getTheme('slate');
    expect(slate.id).toBe('slate');

    // @ts-expect-error test fallback for unknown id
    const fallback = getTheme('unknown-theme');
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe(AVAILABLE_THEMES[0].id);
  });
});
