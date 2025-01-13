# Tempo Integration

## Important Setup Notes
- Tempo error handling script must load before main app script in head section
- Scripts should be in head section for proper initialization
- TempoDevtools.init() must be called before app renders
- Check TempoDevtools.isInitialized() before using tempo routes
- Place tempo script in head of index.html for early loading

## Common Issues
- Container setup issues often related to initialization order
- Ensure all tempo dependencies are properly loaded before app starts
