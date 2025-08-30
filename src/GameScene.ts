import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private obstacles!: Phaser.Physics.Arcade.Group;
    private ground!: Phaser.Physics.Arcade.StaticGroup;
    // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Unused
    private jumpKey!: Phaser.Input.Keyboard.Key;
    private crouchKey!: Phaser.Input.Keyboard.Key;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gameSpeed: number = 200;
    private lastObstacleTime: number = 0;
    private startTime: number = 0;
    private jumpCount: number = 0;
    private isCrouching: boolean = false;
    private playerNormalHeight: number = 80;
    private playerCrouchHeight: number = 40;
    private playerWidth: number = 60;
    private playerVisual!: Phaser.GameObjects.Rectangle;
    private diagnosticText!: Phaser.GameObjects.Text;
    private keyPressHistory: string[] = [];
    private wasOnGround: boolean = true;

    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.startTime = this.time.now;
        this.gameSpeed = 200;
        this.score = 0;
        this.lastObstacleTime = 0;

        // Create capybara pixel art texture
        this.createCapybaraTexture();
        
        // Create obstacle textures
        this.createFallenLogTexture();
        this.createRiverTexture();
        this.createBranchTexture();

        // Create ground (scaled up and widened)
        this.ground = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(600, 350, 1200, 100, 0x8B4513);
        this.ground.add(groundRect);

        // Create player (capybara)
        const playerX = this.cameras.main.width * 0.1;
        
        // Create player with capybara texture
        this.player = this.physics.add.sprite(playerX, 250, 'capybara');
        this.player.setSize(this.playerWidth, this.playerNormalHeight);
        this.playerVisual = this.player as any; // Use the sprite as the visual

        // Set up physics for player
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        // Create obstacles group - using config to disable gravity by default
        this.obstacles = this.physics.add.group({
            allowGravity: false
        });

        // Set up collisions
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, undefined, this);

        // Set up keyboard controls
        this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.crouchKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Set up touch controls
        this.setupTouchControls();

        // Create score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            color: '#000' 
        });

        // Create diagnostic text - compact version (only on localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.diagnosticText = this.add.text(16, 50, 'Debug: Ready', {
                fontSize: '14px',
                color: '#FF0000',
                backgroundColor: '#FFFFFF88',
                padding: { x: 3, y: 3 }
            });
        }

        // Jump count will be reset in update loop when on ground
    }

    setupTouchControls() {
        let startY = 0;
        let startTime = 0;
        let touchStarted = false;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            startY = pointer.y;
            startTime = this.time.now;
            touchStarted = true;
            console.log('Touch started at:', startY);
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!touchStarted) return;
            
            const swipeDistance = pointer.y - startY;
            const swipeTime = this.time.now - startTime;
            
            console.log(`Touch ended: distance=${swipeDistance}, time=${swipeTime}`);

            if (Math.abs(swipeDistance) > 30 && swipeTime < 800) {
                if (swipeDistance > 30) {
                    // Swipe down - crouch
                    console.log('Swipe down detected - crouching');
                    this.addKeyPress('SWIPE DOWN');
                    this.handleCrouch(true);
                    
                    // Release crouch after a moment
                    this.time.delayedCall(600, () => {
                        console.log('Auto-releasing crouch');
                        this.handleCrouch(false);
                    });
                } else {
                    // Swipe up - could be used for something else later
                    console.log('Swipe up detected');
                }
            } else if (swipeTime < 300 && Math.abs(swipeDistance) < 20) {
                // Quick tap with minimal movement - jump
                console.log('Tap detected - jumping');
                this.addKeyPress('TAP');
                this.handleJump();
            }
            
            touchStarted = false;
        });

        // Handle pointer cancel (when user drags off screen)
        this.input.on('pointercancel', () => {
            touchStarted = false;
        });
    }

    handleJump() {
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        
        // Allow jump if we have jumps remaining
        if (this.jumpCount < 2) {
            body.setVelocityY(-500);
            this.jumpCount++;
            
            // Log jump for debugging
            console.log(`Jump executed! Count: ${this.jumpCount}, onFloor: ${body.onFloor()}`);
        }
    }

    handleCrouch(crouch: boolean) {
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        
        if (crouch && !this.isCrouching && body.onFloor()) {
            this.isCrouching = true;
            // Store current position before changing size
            const currentBottom = this.player.y + (this.playerNormalHeight / 2);
            this.player.setSize(this.playerWidth, this.playerCrouchHeight);
            // Adjust position to keep feet at same level
            this.player.y = currentBottom - (this.playerCrouchHeight / 2);
            this.playerVisual.setSize(this.playerWidth, this.playerCrouchHeight);
        } else if (!crouch && this.isCrouching) {
            this.isCrouching = false;
            // Store current position before changing size
            const currentBottom = this.player.y + (this.playerCrouchHeight / 2);
            this.player.setSize(this.playerWidth, this.playerNormalHeight);
            // Adjust position to keep feet at same level
            this.player.y = currentBottom - (this.playerNormalHeight / 2);
            this.playerVisual.setSize(this.playerWidth, this.playerNormalHeight);
        }
    }

    update(time: number) {
        // Player visual is now the sprite itself, no need to update position

        // Handle keyboard input
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        
        if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
            this.addKeyPress('A');
            this.handleJump();
        }

        // Handle crouch
        if (this.crouchKey.isDown) {
            if (!this.isCrouching) {
                this.addKeyPress('S');
            }
            this.handleCrouch(true);
        } else {
            this.handleCrouch(false);
        }

        // Reset jump count only when landing (transition from air to ground)
        const isOnGround = body.onFloor();
        if (!this.wasOnGround && isOnGround) {
            // Just landed - reset jump count
            this.jumpCount = 0;
            console.log('Landed - jump count reset to 0');
        }
        this.wasOnGround = isOnGround;

        // Update score (based on survival time)
        this.score = Math.floor((time - this.startTime) / 100);
        this.scoreText.setText('Score: ' + this.score);

        // Update diagnostic display
        this.updateDiagnostics(body);

        // Spawn obstacles (less frequently for bigger sprites)
        if (time - this.lastObstacleTime > Phaser.Math.Between(2500, 4500)) {
            this.spawnObstacle();
            this.lastObstacleTime = time;
        }

        // Move and clean up obstacles
        this.obstacles.children.entries.forEach((obstacle) => {
            const obs = obstacle as Phaser.Physics.Arcade.Sprite;
            
            // Move obstacle horizontally only by setting velocity
            const obsBody = obs.body as Phaser.Physics.Arcade.Body;
            obsBody.setVelocityX(-this.gameSpeed);
            obsBody.setVelocityY(0);
            
            // Update obstacle visual position (if it's a separate visual)
            const obsVisual = obs.getData('visual');
            if (obsVisual && obsVisual !== obs) {
                (obsVisual as Phaser.GameObjects.Rectangle).setPosition(obs.x, obs.y);
            }

            // Remove obstacles that have gone off screen
            if (obs.x < -50) {
                if (obsVisual && obsVisual !== obs) {
                    (obsVisual as Phaser.GameObjects.Rectangle).destroy();
                }
                obs.destroy();
            }
        });

        // Gradually increase game speed
        if (time - this.startTime > 10000) {
            this.gameSpeed = 200 + Math.floor((time - this.startTime) / 10000) * 20;
        }
    }

    spawnObstacle() {
        const obstacleTypes = ['tree', 'branch', 'river'];
        const type = Phaser.Math.RND.pick(obstacleTypes);
        
        let obstacle: Phaser.Physics.Arcade.Sprite;
        let visual: Phaser.GameObjects.Rectangle;
        
        switch(type) {
            case 'tree':
                // Fallen tree - must jump over (scaled up)
                obstacle = this.obstacles.create(1250, 270, 'fallenLog');
                obstacle.setSize(80, 60);
                visual = obstacle as any; // Use the sprite as visual
                break;
            case 'branch':
                // Low branch - must crouch under (scaled up)
                obstacle = this.obstacles.create(1250, 230, 'spikeBranch');
                obstacle.setSize(80, 40);
                visual = obstacle as any; // Use the sprite as visual
                break;
            case 'river':
                // River with crocodiles - must jump over (extended to bottom, same hitbox height as tree)
                obstacle = this.obstacles.create(1250, 280, 'river');
                obstacle.setSize(120, 60); // Same height as tree log
                visual = obstacle as any; // Use the sprite as visual
                break;
            default:
                return;
        }
        
        obstacle.setData('visual', visual);
        obstacle.setData('type', type);
        const obstacleBody = obstacle.body as Phaser.Physics.Arcade.Body;
        obstacleBody.setImmovable(true);
    }

    hitObstacle(_player: any, obstacle: any) {
        const obstacleType = obstacle.getData('type');
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        
        console.log(`Hit obstacle: ${obstacleType}, onFloor: ${body.onFloor()}, crouching: ${this.isCrouching}`);
        
        // Check if player successfully avoided the obstacle
        if (obstacleType === 'branch' && this.isCrouching) {
            // Successfully crouched under branch
            console.log('Successfully crouched under branch');
            return;
        }
        
        if ((obstacleType === 'tree' || obstacleType === 'river') && !body.onFloor()) {
            // Successfully jumped over obstacle
            console.log('Successfully jumped over obstacle');
            return;
        }
        
        // Game over
        console.log('Game over - collision!');
        this.scene.start('GameOverScene', { score: this.score });
    }

    addKeyPress(key: string) {
        this.keyPressHistory.unshift(key);
        if (this.keyPressHistory.length > 3) {
            this.keyPressHistory.pop();
        }
    }

    updateDiagnostics(body: Phaser.Physics.Arcade.Body) {
        if (this.diagnosticText) {
            const keys = this.keyPressHistory.length > 0 ? this.keyPressHistory.join(' ') : 'None';
            const diagnostic = `Jumps: ${this.jumpCount} | Ground: ${body.onFloor() ? 'Y' : 'N'} | Crouch: ${this.isCrouching ? 'Y' : 'N'} | Keys: ${keys}`;
            this.diagnosticText.setText(diagnostic);
        }
    }

    createCapybaraTexture() {
        // Create a 60x80 pixel art capybara - PROPER SIDE PROFILE FACING RIGHT
        // Check if texture already exists, if so, destroy it first
        if (this.textures.exists('capybara')) {
            this.textures.remove('capybara');
        }
        const canvas = this.textures.createCanvas('capybara', 60, 80);
        const ctx = canvas?.getContext();
        if (!ctx) return;
        
        // Realistic capybara colors
        const brown = '#8B6F47';      // Main body
        const darkBrown = '#654321';  // Dark details
        const lightBrown = '#A0825A'; // Light fur
        const black = '#000000';      // Eye/nose/details
        const pink = '#D4A574';       // Inner ear/nose
        
        // Clear canvas
        ctx.clearRect(0, 0, 60, 80);
        
        // BODY - Capybaras are very barrel-shaped and chunky
        this.drawPixelRect(ctx, 12, 30, 40, 30, brown);
        
        // HEAD - Large, rectangular head characteristic of capybaras
        this.drawPixelRect(ctx, 8, 18, 28, 18, brown);
        
        // SNOUT - Capybaras have a very distinctive blunt, square snout
        this.drawPixelRect(ctx, 4, 22, 8, 10, lightBrown);
        
        // NOSTRIL - Large, prominent nostril
        this.drawPixelRect(ctx, 5, 25, 2, 2, black);
        
        // EYE - Small, placed higher on head
        this.drawPixelRect(ctx, 18, 20, 3, 3, black);
        this.drawPixelRect(ctx, 19, 20, 1, 1, lightBrown); // Eye shine
        
        // EAR - Small, round ear on top of head
        this.drawPixelRect(ctx, 22, 16, 6, 6, darkBrown);
        this.drawPixelRect(ctx, 24, 18, 2, 2, pink);
        
        // LEGS - Short, stubby legs (capybaras have very short legs)
        this.drawPixelRect(ctx, 18, 58, 5, 12, darkBrown); // Front leg
        this.drawPixelRect(ctx, 32, 58, 5, 12, darkBrown); // Back leg
        this.drawPixelRect(ctx, 26, 58, 4, 12, darkBrown); // Middle leg (partially visible)
        
        // BODY DEFINITION
        this.drawPixelRect(ctx, 12, 58, 40, 2, darkBrown); // Belly line
        this.drawPixelRect(ctx, 12, 30, 40, 2, darkBrown); // Back line
        
        // FACE DETAILS - Mouth line
        this.drawPixelRect(ctx, 6, 28, 6, 1, darkBrown);
        
        // CHEST/NECK area
        this.drawPixelRect(ctx, 12, 25, 8, 8, lightBrown);
        
        // Make the body more rounded at the back (capybaras are very round)
        this.drawPixelRect(ctx, 50, 32, 2, 26, brown);
        this.drawPixelRect(ctx, 52, 35, 2, 20, lightBrown);
        
        canvas?.refresh();
    }

    createFallenLogTexture() {
        // Create an 80x60 pixel art fallen log
        if (this.textures.exists('fallenLog')) {
            this.textures.remove('fallenLog');
        }
        const canvas = this.textures.createCanvas('fallenLog', 80, 60);
        const ctx = canvas?.getContext();
        if (!ctx) return;
        
        // Amazon forest log colors
        const darkBrown = '#654321';    // Main log color
        const lightBrown = '#8B6914';   // Bark texture
        const mediumBrown = '#6B4423';  // Bark lines
        const veryDarkBrown = '#4A2C17'; // Shadows/cracks
        
        // Clear canvas
        ctx.clearRect(0, 0, 80, 60);
        
        // Main log body (cylindrical shape)
        this.drawPixelRect(ctx, 0, 10, 80, 40, darkBrown);
        
        // Top and bottom rounded edges
        this.drawPixelRect(ctx, 2, 8, 76, 4, mediumBrown);
        this.drawPixelRect(ctx, 2, 50, 76, 4, mediumBrown);
        
        // Log end (left side - cut end with tree rings)
        this.drawPixelRect(ctx, 0, 10, 8, 40, lightBrown);
        
        // Tree rings on the cut end
        this.drawPixelCircle(ctx, 4, 30, 16, mediumBrown, false);
        this.drawPixelCircle(ctx, 4, 30, 12, veryDarkBrown, false);
        this.drawPixelCircle(ctx, 4, 30, 8, mediumBrown, false);
        this.drawPixelCircle(ctx, 4, 30, 4, darkBrown, true);
        
        // Bark texture lines running lengthwise
        for (let x = 12; x < 80; x += 8) {
            this.drawPixelRect(ctx, x, 12, 2, 36, mediumBrown);
        }
        
        // Some horizontal bark cracks
        this.drawPixelRect(ctx, 10, 18, 60, 2, veryDarkBrown);
        this.drawPixelRect(ctx, 15, 35, 50, 2, veryDarkBrown);
        this.drawPixelRect(ctx, 20, 42, 45, 2, veryDarkBrown);
        
        // Small branch stubs
        this.drawPixelRect(ctx, 25, 8, 4, 6, veryDarkBrown);
        this.drawPixelRect(ctx, 45, 50, 6, 4, veryDarkBrown);
        
        canvas?.refresh();
    }

    createRiverTexture() {
        // Create a 120x80 pixel art river with crocodiles (extended to bottom of screen)
        if (this.textures.exists('river')) {
            this.textures.remove('river');
        }
        const canvas = this.textures.createCanvas('river', 120, 80);
        const ctx = canvas?.getContext();
        if (!ctx) return;
        
        // Amazon river colors
        const darkBlue = '#1E3A8A';     // Deep water
        const mediumBlue = '#3B82F6';   // Water surface
        const lightBlue = '#60A5FA';    // Water highlights
        const green = '#16A34A';        // Crocodile
        const darkGreen = '#15803D';    // Crocodile details
        const yellow = '#FEF08A';       // Crocodile eyes
        const black = '#000000';        // Pupils
        const brownMud = '#6B4423';     // River bottom/mud
        
        // Clear canvas
        ctx.clearRect(0, 0, 120, 80);
        
        // Water base (full height)
        this.drawPixelRect(ctx, 0, 0, 120, 80, darkBlue);
        
        // Water surface ripples (at the top)
        this.drawPixelRect(ctx, 0, 8, 120, 6, mediumBlue);
        this.drawPixelRect(ctx, 0, 20, 120, 4, mediumBlue);
        this.drawPixelRect(ctx, 0, 30, 120, 3, lightBlue);
        
        // Mid-water ripples
        this.drawPixelRect(ctx, 0, 45, 120, 3, mediumBlue);
        this.drawPixelRect(ctx, 0, 55, 120, 2, lightBlue);
        
        // River bottom/mud (darker at bottom)
        this.drawPixelRect(ctx, 0, 70, 120, 10, brownMud);
        
        // Water highlights/ripples
        for (let x = 10; x < 120; x += 20) {
            this.drawPixelRect(ctx, x, 12, 8, 2, lightBlue);
            this.drawPixelRect(ctx, x + 5, 35, 6, 2, lightBlue);
        }
        
        // Crocodile 1 (left side - mostly submerged)
        this.drawPixelRect(ctx, 15, 15, 20, 8, green);
        // Crocodile eyes poking out
        this.drawPixelRect(ctx, 18, 12, 3, 3, yellow);
        this.drawPixelRect(ctx, 28, 12, 3, 3, yellow);
        this.drawPixelRect(ctx, 19, 13, 1, 1, black);
        this.drawPixelRect(ctx, 29, 13, 1, 1, black);
        // Nostrils
        this.drawPixelRect(ctx, 22, 15, 1, 1, black);
        this.drawPixelRect(ctx, 25, 15, 1, 1, black);
        
        // Crocodile 2 (right side - partially visible)
        this.drawPixelRect(ctx, 80, 18, 25, 10, darkGreen);
        // Eyes
        this.drawPixelRect(ctx, 85, 15, 3, 3, yellow);
        this.drawPixelRect(ctx, 95, 15, 3, 3, yellow);
        this.drawPixelRect(ctx, 86, 16, 1, 1, black);
        this.drawPixelRect(ctx, 96, 16, 1, 1, black);
        // Nostrils
        this.drawPixelRect(ctx, 90, 18, 1, 1, black);
        
        // Additional crocodile lurking deeper
        this.drawPixelRect(ctx, 45, 40, 15, 6, darkGreen);
        this.drawPixelRect(ctx, 48, 38, 2, 2, yellow); // Just eyes showing
        this.drawPixelRect(ctx, 52, 38, 2, 2, yellow);
        
        canvas?.refresh();
    }

    createBranchTexture() {
        // Create an 80x40 pixel art spiky leafy branch
        if (this.textures.exists('spikeBranch')) {
            this.textures.remove('spikeBranch');
        }
        const canvas = this.textures.createCanvas('spikeBranch', 80, 40);
        const ctx = canvas?.getContext();
        if (!ctx) return;
        
        // Amazon branch colors
        const brown = '#92400E';        // Branch
        const darkBrown = '#451A03';    // Branch shadows
        const green = '#16A34A';        // Leaves
        const darkGreen = '#15803D';    // Leaf shadows
        const lightGreen = '#22C55E';   // Leaf highlights
        
        // Clear canvas
        ctx.clearRect(0, 0, 80, 40);
        
        // Main branch running horizontally
        this.drawPixelRect(ctx, 0, 18, 80, 8, brown);
        this.drawPixelRect(ctx, 0, 24, 80, 2, darkBrown); // Shadow line
        
        // Leaves clusters (spiky shapes)
        // Cluster 1
        this.drawPixelRect(ctx, 10, 8, 12, 8, green);
        this.drawPixelRect(ctx, 8, 12, 4, 4, green);   // Left spike
        this.drawPixelRect(ctx, 20, 10, 4, 4, green);  // Right spike
        this.drawPixelRect(ctx, 14, 6, 4, 4, green);   // Top spike
        this.drawPixelRect(ctx, 12, 10, 8, 2, lightGreen); // Highlight
        
        // Cluster 2
        this.drawPixelRect(ctx, 35, 5, 15, 10, darkGreen);
        this.drawPixelRect(ctx, 32, 8, 4, 4, darkGreen); // Left spike
        this.drawPixelRect(ctx, 48, 7, 4, 4, darkGreen); // Right spike
        this.drawPixelRect(ctx, 40, 3, 6, 4, darkGreen); // Top spike
        this.drawPixelRect(ctx, 38, 7, 10, 2, green);    // Highlight
        
        // Cluster 3
        this.drawPixelRect(ctx, 60, 10, 14, 6, green);
        this.drawPixelRect(ctx, 58, 12, 4, 3, green);   // Left spike
        this.drawPixelRect(ctx, 72, 11, 4, 3, green);   // Right spike
        this.drawPixelRect(ctx, 65, 8, 6, 4, green);    // Top spike
        
        // Small thorns/spikes pointing down (dangerous!)
        this.drawPixelRect(ctx, 15, 26, 2, 6, darkBrown);
        this.drawPixelRect(ctx, 25, 26, 2, 8, darkBrown);
        this.drawPixelRect(ctx, 40, 26, 2, 7, darkBrown);
        this.drawPixelRect(ctx, 55, 26, 2, 6, darkBrown);
        this.drawPixelRect(ctx, 68, 26, 2, 8, darkBrown);
        
        canvas?.refresh();
    }
    
    drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
    
    drawPixelOutline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
    }

    drawPixelCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string, fill: boolean) {
        ctx.strokeStyle = color;
        if (fill) ctx.fillStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
}