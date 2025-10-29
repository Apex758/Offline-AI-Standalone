# Split View Implementation Quick Reference

## Critical Files to Modify

### 1. [`frontend/src/types/index.ts`](frontend/src/types/index.ts:1)

**Add:**
```typescript
export interface SplitViewState {
  isActive: boolean;
  leftTabId: string | null;
  rightTabId: string | null;
  activePaneId: 'left' | 'right';
}
```

**Modify Tab interface (line 16):**
```typescript
// REMOVE 'split' from type union
// REMOVE splitTabs?: [string, string]
// ADD lastActiveTime?: number

export interface Tab {
  id: string;
  title: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 
        'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 
        'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
  active: boolean;
  data?: any;
  lastActiveTime?: number;  // NEW
}
```

**Modify Tool interface (line 25):**
```typescript
// REMOVE 'split' from type union
type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 
      'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 
      'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
```

---

### 2. [`frontend/src/components/Dashboard.tsx`](frontend/src/components/Dashboard.tsx:1)

#### A. Add State (after line 177)
```typescript
const [splitView, setSplitView] = useState<SplitViewState>({
  isActive: false,
  leftTabId: null,
  rightTabId: null,
  activePaneId: 'left'
});
```

#### B. Add Migration Function (before useEffect hooks)
```typescript
const migrateLegacySplitTabs = (savedTabs: Tab[]): Tab[] => {
  const splitTabs = savedTabs.filter(t => t.type === 'split');
  const regularTabs = savedTabs.filter(t => t.type !== 'split');
  
  if (splitTabs.length > 0) {
    const firstSplit = splitTabs[0];
    
    if (firstSplit.splitTabs && firstSplit.splitTabs.length === 2) {
      const [leftId, rightId] = firstSplit.splitTabs;
      const leftExists = regularTabs.find(t => t.id === leftId);
      const rightExists = regularTabs.find(t => t.id === rightId);
      
      if (leftExists && rightExists) {
        setSplitView({
          isActive: true,
          leftTabId: leftId,
          rightTabId: rightId,
          activePaneId: 'left'
        });
        
        localStorage.setItem('dashboard-split-view', JSON.stringify({
          isActive: true,
          leftTabId: leftId,
          rightTabId: rightId,
          activePaneId: 'left'
        }));
      }
    }
  }
  
  return regularTabs;
};
```

#### C. Update Load Effect (line 287-302)
```typescript
useEffect(() => {
  const savedTabs = localStorage.getItem('dashboard-tabs');
  const savedActiveTabId = localStorage.getItem('dashboard-active-tab');
  const savedSplitView = localStorage.getItem('dashboard-split-view');
  
  if (savedTabs) {
    try {
      const parsedTabs = JSON.parse(savedTabs);
      const migratedTabs = migrateLegacySplitTabs(parsedTabs);
      setTabs(migratedTabs);
      
      if (savedActiveTabId) {
        setActiveTabId(savedActiveTabId);
      }
      
      // Load split view state
      if (savedSplitView) {
        const parsed = JSON.parse(savedSplitView);
        const leftExists = migratedTabs.find(t => t.id === parsed.leftTabId);
        const rightExists = migratedTabs.find(t => t.id === parsed.rightTabId);
        
        if (leftExists && rightExists) {
          setSplitView(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading saved tabs:', error);
    }
  }
}, []);
```

#### D. Add Split View Persistence (new useEffect)
```typescript
useEffect(() => {
  if (splitView.isActive) {
    localStorage.setItem('dashboard-split-view', JSON.stringify(splitView));
  } else {
    localStorage.removeItem('dashboard-split-view');
  }
}, [splitView]);
```

#### E. Add Toggle Function (before closeTab)
```typescript
const toggleSplitView = () => {
  if (splitView.isActive) {
    setSplitView({
      isActive: false,
      leftTabId: null,
      rightTabId: null,
      activePaneId: 'left'
    });
  } else {
    if (tabs.length < 2) return;
    
    const sortedTabs = [...tabs].sort((a, b) => 
      (b.lastActiveTime || 0) - (a.lastActiveTime || 0)
    );
    
    setSplitView({
      isActive: true,
      leftTabId: sortedTabs[0].id,
      rightTabId: sortedTabs[1].id,
      activePaneId: 'left'
    });
  }
};
```

#### F. Replace renderTabContent (line 581-600)
```typescript
const renderTabContent = () => {
  if (splitView.isActive && splitView.leftTabId && splitView.rightTabId) {
    const leftTab = tabs.find(t => t.id === splitView.leftTabId);
    const rightTab = tabs.find(t => t.id === splitView.rightTabId);

    if (!leftTab || !rightTab) {
      setSplitView({ 
        isActive: false, 
        leftTabId: null, 
        rightTabId: null, 
        activePaneId: 'left' 
      });
      return null;
    }

    return (
      <div className="flex h-full divide-x divide-gray-200">
        <div 
          className={`flex-1 overflow-hidden ${
            splitView.activePaneId === 'left' ? 'ring-2 ring-inset ring-blue-400' : ''
          }`}
          onClick={() => setSplitView(prev => ({ ...prev, activePaneId: 'left' }))}
        >
          {renderSingleTabContent(leftTab)}
        </div>
        <div 
          className={`flex-1 overflow-hidden ${
            splitView.activePaneId === 'right' ? 'ring-2 ring-inset ring-blue-400' : ''
          }`}
          onClick={() => setSplitView(prev => ({ ...prev, activePaneId: 'right' }))}
        >
          {renderSingleTabContent(rightTab)}
        </div>
      </div>
    );
  }

  const activeTab = tabs.find(t => t.id === activeTabId);
  if (!activeTab) return null;
  
  return renderSingleTabContent(activeTab);
};
```

#### G. Update closeTab (line 264-285)
```typescript
const closeTab = (tabId: string) => {
  const updatedTabs = tabs.filter(tab => tab.id !== tabId);
  setTabs(updatedTabs);
  
  if (splitView.isActive && (tabId === splitView.leftTabId || tabId === splitView.rightTabId)) {
    if (updatedTabs.length < 2) {
      setSplitView({
        isActive: false,
        leftTabId: null,
        rightTabId: null,
        activePaneId: 'left'
      });
      if (updatedTabs.length > 0) {
        setActiveTabId(updatedTabs[0].id);
      }
    } else {
      const availableTab = updatedTabs.find(t => 
        t.id !== splitView.leftTabId && t.id !== splitView.rightTabId
      );
      
      if (availableTab) {
        if (tabId === splitView.leftTabId) {
          setSplitView(prev => ({ ...prev, leftTabId: availableTab.id }));
        } else {
          setSplitView(prev => ({ ...prev, rightTabId: availableTab.id }));
        }
      }
    }
  } else {
    if (activeTabId === tabId && updatedTabs.length > 0) {
      setActiveTabId(updatedTabs[updatedTabs.length - 1].id);
    } else if (updatedTabs.length === 0) {
      setActiveTabId(null);
    }
  }
};
```

#### H. Update getTabCountByType (line 226-228)
```typescript
const getTabCountByType = (type: string) => {
  return tabs.filter(tab => tab.type === type).length;
};
```

#### I. Update Tab Click Handler (around line 1093)
```typescript
// Find where tabs are clicked in the tab bar
// Replace with:
onClick={() => {
  if (!splitView.isActive) {
    setActiveTabId(tab.id);
  } else {
    if (splitView.activePaneId === 'left') {
      setSplitView(prev => ({ ...prev, leftTabId: tab.id }));
    } else {
      setSplitView(prev => ({ ...prev, rightTabId: tab.id }));
    }
  }
  
  // Update last active time
  setTabs(prev => prev.map(t => ({
    ...t,
    lastActiveTime: t.id === tab.id ? Date.now() : t.lastActiveTime
  })));
}}
```

#### J. Add Split Toggle Button (line 1177, after Close All Tabs button)
```typescript
{tabs.length >= 2 && (
  <button
    onClick={toggleSplitView}
    className={`p-2 rounded-lg transition group ml-2 flex-shrink-0 ${
      splitView.isActive 
        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
        : 'hover:bg-gray-100 text-gray-600'
    }`}
    title={splitView.isActive ? 'Exit Split View' : 'Enter Split View'}
  >
    <Columns className="w-5 h-5" />
  </button>
)}
```

#### K. Add Split Indicators to Tabs (in tab rendering, around line 1082)
```typescript
const isInSplitView = splitView.isActive && 
  (tab.id === splitView.leftTabId || tab.id === splitView.rightTabId);

// Add to tab className or style:
{isInSplitView && (
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
)}
```

#### L. Remove These Functions/Logic
```typescript
// DELETE createSplitTab() function (line 330-348)
// DELETE handleTabContextMenu() function (line 350-358)
// DELETE handleSplitWithTab() function (line 360-364)
// REMOVE split-specific logic from groupedTabs (line 602-611)
// REMOVE 'split' color generation (line 168)
// REMOVE context menu for split (line 630-668)
```

---

## Testing Checklist

### Before Implementation
- [x] Review architecture document
- [x] Understand state flow
- [x] Identify all code locations to modify

### During Implementation
- [ ] Test migration from old split tabs
- [ ] Test split toggle button
- [ ] Test tab switching in split mode
- [ ] Test closing tabs in split mode
- [ ] Test persistence across refresh
- [ ] Test with < 2 tabs (button disabled)
- [ ] Test data sync between panes
- [ ] Test all tab types in split view

### After Implementation
- [ ] Remove all console.logs
- [ ] Update documentation
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] User acceptance testing

---

## Common Pitfalls to Avoid

1. **Don't forget to remove `'split'` from ALL type unions**
   - Tab interface
   - Tool interface
   - tabColors generation
   - Any switch/case statements

2. **Don't forget to handle tab closure edge cases**
   - What if both split tabs are closed?
   - What if there's only 1 tab left?
   - What if the closed tab was in split view?

3. **Don't forget persistence**
   - Save split view state
   - Load split view state
   - Validate loaded state (tabs might not exist)
   - Clean up on exit if needed

4. **Don't forget last active time tracking**
   - Update on tab click
   - Use for smart split defaults
   - Persist in localStorage

5. **Don't forget visual indicators**
   - Split toggle button state
   - Active pane indicator
   - Tabs in split view indicator

---

## Deployment Strategy

1. **Phase 1**: Type updates (no visual changes)
2. **Phase 2**: Add new state (no functional changes)
3. **Phase 3**: Add migration logic (backward compatible)
4. **Phase 4**: Update rendering logic (users see new behavior)
5. **Phase 5**: Add UI controls (full feature available)
6. **Phase 6**: Remove old code (cleanup)
7. **Phase 7**: Testing and polish

Each phase can be deployed independently for gradual rollout.

---

## Success Criteria

✅ No 'split' type in Tab or Tool interfaces
✅ No split tabs in tabs array
✅ Split view state is separate from tab data
✅ Clicking tabs in split mode switches panes
✅ Closing tabs in split mode auto-replaces or exits
✅ Split state persists across sessions
✅ Old split tabs automatically migrate
✅ All existing functionality still works
✅ Code is simpler and more maintainable
✅ User experience is improved