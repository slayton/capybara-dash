# Game Development Best Practices
*Lessons learned from building Capybara Dash*

## 🎯 Planning & Requirements

### Start with Clear Vision
- **Define the core loop first:** What does the player do repeatedly?
- **Identify reference games:** Helps communicate vision quickly
- **Set realistic scope:** Start simple, add complexity later
- **Consider target platforms early:** Desktop vs mobile affects control design

### Requirements Gathering Questions
```
Core Gameplay:
- What is the main player action?
- How does the player win/lose?
- What makes it challenging?
- How does difficulty progress?

Art & Style:
- What visual style? (pixel art, cartoon, realistic)
- What's the color palette/theme?
- How many animation frames needed?
- What's the target resolution?

Technical:
- What platforms? (web, mobile, desktop)
- What input methods? (keyboard, touch, gamepad)
- What framework/engine?
- How will it be deployed?
```

## 🛠️ Technical Architecture

### Framework Selection
- **Start simple:** Use the minimum viable tech stack
- **Phaser 3 for web games:** Excellent for 2D browser games
- **TypeScript recommended:** Better debugging and IDE support
- **Vite for bundling:** Fast development server and builds

### Project Structure Best Practices
```
game-project/
├── src/
│   ├── scenes/          # Separate files per game state
│   ├── sprites/         # Character and object classes
│   ├── utils/           # Helper functions
│   └── main.ts          # Game configuration
├── assets/              # Images, sounds, fonts
├── public/              # Static files
├── package.json
├── vite.config.ts
└── README.md
```

### Physics & Movement
- **Use physics engine properly:** Don't fight the engine with manual positioning
- **Velocity over position:** Use `setVelocity()` not direct position changes
- **Static vs Dynamic bodies:** Static for immovable objects, dynamic for moving ones
- **Group configurations:** Set physics defaults at group level

## 🎮 Game Mechanics

### Controls & Input
- **Responsive controls first:** Feel should be immediate and predictable
- **Multiple input methods:** Support both keyboard and touch
- **Clear input mapping:** Document which keys do what
- **Debug displays:** Show input state during development

### Collision Detection
- **Logical collision rules:** Define exactly when collisions should/shouldn't happen
- **Debug logging:** Console.log collision events during development
- **Hitbox visualization:** Show collision boundaries during testing
- **Consistent behavior:** Same obstacle types should behave the same way

### Difficulty Progression
- **Gradual ramping:** Slow, steady difficulty increase
- **Multiple factors:** Speed, frequency, complexity
- **Playtesting:** Get feedback on difficulty curve
- **Adjustable parameters:** Make values easy to tweak

## 🎨 Art & Assets

### Pixel Art Guidelines
- **Consistent palette:** Define colors once, reuse everywhere
- **Proper scaling:** Scale up evenly (100%, 200%, 400%)
- **Readable silhouettes:** Characters should be recognizable in silhouette
- **Animation frames:** Start with static, add animation later

### Asset Management
- **Procedural generation:** Create sprites in code for easy iteration
- **Texture lifecycle:** Handle creation/destruction properly for restarts
- **Naming conventions:** Clear, consistent asset names
- **Size optimization:** Right-size assets for target resolution

## 🐛 Debugging & Testing

### Development Tools
- **Debug overlays:** Show game state, physics bodies, input
- **Console logging:** Key game events and state changes
- **Hot reloading:** Fast iteration with Vite
- **Browser dev tools:** Leverage built-in debugging

### Common Issues & Solutions
```
Issue: "Objects falling instead of moving horizontally"
Solution: Check gravity settings on physics groups

Issue: "Double jump not working"
Solution: Track jump state properly with landing detection

Issue: "Restart button crashes game"
Solution: Clean up existing textures before recreating

Issue: "Collision detection inconsistent"
Solution: Add debug logging to trace collision events
```

### Testing Strategy
- **Test controls first:** Make sure basic interaction works
- **Test edge cases:** What happens at boundaries?
- **Test restart flow:** Ensure clean state reset
- **Cross-platform testing:** Desktop and mobile behavior

## 📱 Platform Considerations

### Web Deployment
- **Responsive design:** Game should scale to different screen sizes
- **Touch optimization:** Buttons and swipe areas large enough
- **Performance:** 60fps target, efficient asset loading
- **Browser compatibility:** Test on multiple browsers

### Mobile Considerations
- **Touch controls:** Different from desktop, design accordingly
- **Screen orientation:** Portrait vs landscape
- **Performance limits:** Mobile devices have less power
- **Network conditions:** Assume slower connections

## 🚀 Development Process

### Iterative Development
1. **Core loop first:** Get basic gameplay working
2. **Add one feature at a time:** Don't try to do everything at once
3. **Test frequently:** Catch issues early
4. **Polish last:** Functionality before aesthetics

### Version Control
- **Commit often:** Small, logical commits
- **Descriptive messages:** Clear commit descriptions
- **Tag releases:** Mark working versions
- **Backup regularly:** Don't lose work

### Code Quality
- **Readable code:** Clear variable and function names
- **Consistent formatting:** Use a formatter (Prettier)
- **Comment sparingly:** Code should be self-documenting
- **Refactor regularly:** Clean up as you go

## 🎯 Next Game Preparation

### Pre-Development Checklist
- [ ] Define core gameplay loop in one sentence
- [ ] Choose reference games for comparison
- [ ] Sketch basic game flow and UI
- [ ] Identify required assets (sprites, sounds, etc.)
- [ ] Set up development environment
- [ ] Create git repository
- [ ] Write basic project README

### Technology Decisions
- [ ] Game engine/framework choice justified
- [ ] Target platform(s) identified
- [ ] Asset creation pipeline planned
- [ ] Deployment strategy outlined

### First Implementation Goals
- [ ] Player can move and interact
- [ ] Basic collision detection works
- [ ] Game over/restart cycle functions
- [ ] Debug tools are in place

## 💡 Key Takeaways

1. **Start simple, iterate quickly** - Basic functionality first, polish later
2. **Plan the art pipeline** - Know how you'll create and manage assets
3. **Debug tools are essential** - Invest time in development helpers
4. **Test on target platforms** - Don't assume it works everywhere
5. **Physics engines have opinions** - Work with them, not against them
6. **User feedback is invaluable** - Get eyes on your game early and often

---

*Remember: The goal is to create something playable and fun. Perfect is the enemy of good!*