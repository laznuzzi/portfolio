# Claude Development Guidelines

## Problem-Solving Approach

### When Stuck - Suggest Multiple Approaches

If an approach has been attempted **2-3 times** without success, STOP and propose alternative solutions:

**Example: Layer Reveal Animation**
- ❌ Approach 1: Sticky positioning with z-index layering (tried 5+ times - failed)
- ✅ Approach 2: GSAP ScrollTrigger with fixed positioning (worked immediately)

### Alternative Approaches to Consider

When something isn't working, evaluate:

1. **Different CSS positioning strategies**
   - Sticky vs Fixed vs Absolute vs Relative
   - Different z-index hierarchies

2. **Animation libraries**
   - GSAP ScrollTrigger
   - CSS animations
   - Intersection Observer API

3. **DOM structure changes**
   - Wrapper elements
   - Different nesting hierarchies
   - Separate layers vs combined sections

4. **Hybrid approaches**
   - Combining CSS and JavaScript
   - Progressive enhancement

### Recognition Patterns

Signs you're stuck in a loop:
- User says "that doesn't work" 3+ times
- Same error/issue keeps appearing
- Making only small tweaks to the same approach
- User frustration is increasing

### Action When Stuck

1. **Acknowledge the pattern**: "I've been trying the sticky approach multiple times without success"
2. **Propose alternatives**: "Let me suggest 2-3 different ways we could achieve this"
3. **Explain trade-offs**: Briefly note pros/cons of each approach
4. **Ask for preference**: Let user choose the direction

## Project-Specific Notes

### Scroll-Based Layer Reveal

**Requirements:**
- Capsules animation (yellow bg) → Files section slides over → More Projects slides over files
- Each layer should cover the previous one completely
- No gaps revealing earlier layers

**Working Solution:**
- Fixed positioning for all layers
- GSAP ScrollTrigger for smooth animations
- Z-index hierarchy: Capsules (2) < Files (3) < More Projects (4)
- ScrollTrigger animates `translateY` from 100% to 0%
