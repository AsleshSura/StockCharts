# 🤝 Contributing Guidelines

Thank you for your interest in contributing to StockCharts! This guide will help you get started and ensure your contributions align with the project's standards and goals.

## 🎯 Contributing Overview

We welcome contributions of all types:
- 🐛 **Bug fixes**
- ✨ **New features** 
- 📖 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- 🧪 **Testing improvements**
- 🚀 **Performance optimizations**

## 🚀 Quick Start for Contributors

### 1. **Fork & Clone**
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/StockCharts.git
cd StockCharts

# Add upstream remote
git remote add upstream https://github.com/AsleshSura/StockCharts.git
```

### 2. **Set Up Development Environment**
```bash
# No build tools required - it's pure frontend!
# Just open files in your preferred editor
code .

# Optional: Start local server for testing
python -m http.server 8000
# or
npx serve .
```

### 3. **Create Feature Branch**
```bash
# Create and switch to feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/issue-description
```

### 4. **Make Changes & Test**
- Make your changes
- Test across different browsers
- Ensure responsive design works
- Test with and without API keys

### 5. **Submit Pull Request**
- Push to your fork
- Create pull request
- Follow the PR template

---

## 🏗️ Development Workflow

### Branch Naming Convention
```
feature/feature-name        # New features
fix/issue-description       # Bug fixes  
docs/update-description     # Documentation
refactor/component-name     # Code refactoring
style/ui-improvements       # UI/styling changes
test/test-description       # Testing improvements
```

### Commit Message Guidelines
We follow the **Conventional Commits** specification:

```bash
# Format
type(scope): description

# Types
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, styling
refactor: code refactoring
test: adding tests
chore: maintenance tasks

# Examples
feat(dashboard): add cryptocurrency comparison feature
fix(api): resolve rate limiting issue with Alpha Vantage
docs(readme): update installation instructions
style(charts): improve dark theme contrast
```

### Code Style Guidelines

#### JavaScript
```javascript
// Use modern ES6+ features
const fetchData = async (symbol) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// Use descriptive variable names
const stockSymbol = 'AAPL';
const timeRange = '1y';
const chartData = processStockData(rawData);

// Add comments for complex logic
// Calculate moving average for trend analysis
const movingAverage = calculateMovingAverage(prices, 20);
```

#### CSS
```css
/* Use consistent naming (BEM methodology) */
.dashboard-card {
    /* Component styles */
}

.dashboard-card__header {
    /* Element styles */
}

.dashboard-card--loading {
    /* Modifier styles */
}

/* Use CSS custom properties for theming */
.component {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
}

/* Consistent spacing using design tokens */
.container {
    padding: var(--spacing-4);
    margin-bottom: var(--spacing-6);
}
```

#### HTML
```html
<!-- Use semantic HTML -->
<main class="dashboard">
    <section class="chart-section">
        <h2>Stock Chart</h2>
        <canvas id="stockChart" aria-label="Stock price chart"></canvas>
    </section>
</main>

<!-- Include accessibility attributes -->
<button 
    class="btn btn-primary" 
    aria-label="Export chart as PNG image"
    type="button"
>
    Export Chart
</button>

<!-- Use proper form structure -->
<form class="stock-form">
    <div class="form-group">
        <label for="stockSymbol">Stock Symbol</label>
        <input 
            type="text" 
            id="stockSymbol" 
            name="stockSymbol"
            placeholder="e.g., AAPL, GOOGL"
            required
        >
    </div>
</form>
```

---

## 🎨 Design Guidelines

### UI/UX Principles
1. **Accessibility First**: WCAG 2.1 AA compliance
2. **Mobile-First**: Responsive design from small screens up
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Performance**: Fast loading and smooth interactions
5. **Consistency**: Follow established design patterns

### Color Guidelines
```css
/* Use theme-aware colors */
:root[data-theme="light"] {
    --color-primary: #2563eb;      /* Blue */
    --color-success: #10b981;      /* Green */
    --color-danger: #ef4444;       /* Red */
    --color-warning: #f59e0b;      /* Yellow */
}

:root[data-theme="dark"] {
    --color-primary: #3b82f6;      /* Lighter blue */
    --color-success: #34d399;      /* Lighter green */
    --color-danger: #f87171;       /* Lighter red */
    --color-warning: #fbbf24;      /* Lighter yellow */
}
```

### Typography Scale
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
```

### Spacing Scale
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
```

---

## 🧪 Testing Guidelines

### Manual Testing Checklist
```
Functionality:
□ All dashboards load without errors
□ Charts render correctly with sample data
□ API integration works with valid keys
□ Fallback to demo data when APIs fail
□ Export functions work (PNG/CSV)
□ Theme switching works smoothly

Browser Testing:
□ Chrome (latest)
□ Firefox (latest)
□ Safari (latest)
□ Edge (latest)

Device Testing:
□ Desktop (1920x1080)
□ Tablet (768x1024)
□ Mobile (375x667)

Accessibility:
□ Keyboard navigation works
□ Screen reader compatibility
□ Color contrast meets WCAG standards
□ Focus indicators are visible
```

### Automated Testing (Optional)
```javascript
// Example test structure
describe('StockCharts Dashboard', () => {
    test('should load default theme', () => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
    
    test('should fetch stock data', async () => {
        const data = await fetchStockData('AAPL', '7d');
        expect(data).toHaveProperty('symbol', 'AAPL');
        expect(data.data).toBeInstanceOf(Array);
    });
    
    test('should export chart as PNG', () => {
        const chart = createMockChart();
        const exportSpy = jest.spyOn(chart, 'toBase64Image');
        
        exportChart();
        
        expect(exportSpy).toHaveBeenCalled();
    });
});
```

---

## 📝 Documentation Standards

### Code Documentation
```javascript
/**
 * Fetches stock data from multiple sources with fallback strategy
 * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} timeRange - Time range ('7d', '30d', '90d', '1y')
 * @returns {Promise<Object>} Normalized stock data object
 * @throws {Error} When all data sources fail
 */
async function fetchStockData(symbol, timeRange) {
    // Implementation...
}
```

### README Updates
When adding new features, update relevant documentation:
- Main README.md
- Dashboard-specific docs
- API documentation
- Architecture docs

### Inline Comments
```javascript
// Good: Explain the "why", not the "what"
// Debounce API calls to prevent rate limiting
const debouncedFetch = debounce(fetchStockData, 300);

// Bad: Obvious what the code does
// Increment counter by 1
counter++;

// Good: Complex business logic explanation
// Apply exponential backoff strategy when API fails
// to avoid overwhelming the service during outages
await sleep(Math.pow(2, retryAttempt) * 1000);
```

---

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to [specific dashboard]
2. Enter [specific data]
3. Click [specific button]
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [Chrome 91, Firefox 89, etc.]
- OS: [Windows 10, macOS 11, etc.]
- Screen size: [Desktop/Tablet/Mobile]
- API key: [Yes/No/Demo]

## Screenshots
If applicable, add screenshots

## Console Errors
Include any console error messages
```

### Critical Bug Priority
- 🔴 **Critical**: App crashes, data loss, security issues
- 🟡 **High**: Major feature broken, significant UX issues
- 🟢 **Medium**: Minor feature issues, cosmetic problems
- 🔵 **Low**: Enhancement requests, nice-to-have features

---

## ✨ Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Other ways to solve this problem

## Additional Context
Screenshots, mockups, examples

## Implementation Ideas
Technical suggestions (optional)
```

### Feature Development Process
1. **Discussion**: Feature discussed in issues
2. **Design**: UI/UX mockups if needed
3. **Implementation**: Code the feature
4. **Testing**: Thorough testing across browsers
5. **Documentation**: Update relevant docs
6. **Review**: Code review and feedback
7. **Merge**: Merge to main branch

---

## 🔍 Code Review Guidelines

### For Contributors
- **Small PRs**: Keep changes focused and manageable
- **Clear Description**: Explain what and why
- **Test Coverage**: Include testing information
- **Documentation**: Update docs if needed
- **Self-Review**: Review your own code first

### For Reviewers
- **Be Constructive**: Provide helpful feedback
- **Check Functionality**: Test the changes locally
- **Review Design**: Ensure UI/UX consistency
- **Verify Documentation**: Confirm docs are updated
- **Performance Impact**: Consider performance implications

### Review Checklist
```
Code Quality:
□ Code follows style guidelines
□ No console.log statements in production code
□ Error handling is appropriate
□ Functions have clear responsibilities

Functionality:
□ Feature works as intended
□ No breaking changes to existing features
□ Responsive design maintained
□ Accessibility standards met

Documentation:
□ Code is well-commented
□ Documentation updated if needed
□ Commit messages are clear

Testing:
□ Manual testing completed
□ No errors in browser console
□ Cross-browser compatibility verified
```

---

## 🚀 Release Process

### Version Numbering
We follow **Semantic Versioning** (semver):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

Example: `v2.1.3`

### Release Steps
1. **Testing**: Comprehensive testing
2. **Documentation**: Update changelogs
3. **Tagging**: Create version tag
4. **Deployment**: Deploy to production
5. **Announcement**: Update community

---

## 🏆 Recognition

### Contributors
All contributors are recognized in:
- GitHub contributors list
- README acknowledgments section
- Release notes (for significant contributions)

### Contribution Types
- 💻 **Code**: New features, bug fixes
- 📖 **Documentation**: Docs improvements
- 🎨 **Design**: UI/UX enhancements
- 🐛 **Bug Reports**: Quality issue reports
- 💡 **Ideas**: Feature suggestions
- 🤔 **Answering Questions**: Community support

---

## 📞 Getting Help

### Where to Ask Questions
- **GitHub Discussions**: General questions, ideas
- **GitHub Issues**: Bug reports, feature requests
- **Code Reviews**: Technical implementation questions

### Response Times
- **Bug Reports**: 24-48 hours
- **Feature Requests**: 2-3 days
- **Questions**: 1-2 days
- **Pull Reviews**: 2-4 days

---

## 📜 Code of Conduct

### Our Standards
- **Respectful**: Treat everyone with respect
- **Inclusive**: Welcome diverse perspectives
- **Constructive**: Provide helpful feedback
- **Professional**: Maintain professional communication
- **Patient**: Help newcomers learn

### Enforcement
Violations should be reported to project maintainers. We reserve the right to remove comments, commits, and contributors who violate our standards.

---

Thank you for contributing to StockCharts! Your contributions help make financial data more accessible to everyone. 🚀

For technical implementation details, see the [Development Guide](./development.md) and [Architecture Documentation](./architecture.md).
