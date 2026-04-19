const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, regexStr, replacement, flags = 'g') {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = new RegExp(regexStr, flags);
  const newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Fix BackendResponse EC EM in highlightService and testimonialService
const services = ['src/services/highlightService.tsx', 'src/services/testimonialService.tsx'];
for (const s of services) {
  replaceInFile(s, 'export interface BackendResponse<T = unknown> \\{\\s*status: number;\\s*message: string;\\s*data\\?: T;\\s*DT\\?: T;\\s*\\}', 'export interface BackendResponse<T = unknown> {\n  status: number;\n  message: string;\n  data?: T;\n  DT?: T;\n  EC?: number;\n  EM?: string;\n}');
}

// 2. Fix Destination imports in components
const componentsDir = 'src/pages/DestinationDetail/components';
if (fs.existsSync(componentsDir)) {
  const dirs = fs.readdirSync(componentsDir);
  for (const dir of dirs) {
    const compPath = path.join(componentsDir, dir, `${dir}.tsx`);
    if (fs.existsSync(compPath)) {
      replaceInFile(compPath, 'import \\{?.*?Destination.*?\\}? from "../../DestinationDetail";?', 'import type { Destination } from "../../../../services/destinationService";');
    }
  }
}

// 3. Fix implicitly any in OverviewTab, ServicesTab, TipsTab
replaceInFile('src/pages/DestinationDetail/components/OverviewTab/OverviewTab.tsx', '\\(text(?!:), index(?!:)\\)', '(text: string, index: number)');
replaceInFile('src/pages/DestinationDetail/components/ServicesTab/ServicesTab.tsx', 'service(?!:) =>', 'service: any =>');
replaceInFile('src/pages/DestinationDetail/components/TipsTab/TipsTab.tsx', '\\(tip(?!:), idx(?!:)\\)', '(tip: any, idx: number)');

// 4. Fix implicitly possibly undefined states and vars
replaceInFile('src/pages/DestinationDetail/DestinationDetail.tsx', 'setData\\(res\\.data\\.data\\)', 'setData(res.data.data!)');
replaceInFile('src/pages/News/News.tsx', 'setNews\\(res\\.data\\.data\\)', 'setNews(res.data.data!)');
replaceInFile('src/pages/Review/Review.tsx', 'setReviews\\(res\\.data\\.data\\)', 'setReviews(res.data.data!)');
replaceInFile('src/pages/SampleItinerary/SampleItinerary.tsx', 'setItineraries\\(res\\.data\\.data\\)', 'setItineraries(res.data.data!)');

// 5. Remove unused vars
replaceInFile('src/pages/Admin/components/DashboardView/DashboardView.tsx', 'idx(?!:)', '_idx');
replaceInFile('src/pages/Admin/components/SettingsView/SettingsView.tsx', 'BellRinging, Eye,?', '');
replaceInFile('src/pages/Home/components/Timeline/Timeline.tsx', 'import React from "react";', '');
replaceInFile('src/pages/Review/Review.tsx', 'const \\[isLoading, setIsLoading\\] = useState<boolean>\\(true\\);', 'const [, setIsLoading] = useState<boolean>(true);');

// 6. Fix Topbar casing in Dashboard.tsx
replaceInFile('src/pages/Dashboard/Dashboard.tsx', '"\\./components/TopBar/Topbar"', '"./components/TopBar/TopBar"');

console.log('Fixes applied.');
