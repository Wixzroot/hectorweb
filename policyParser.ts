export interface ParsedPolicy {
  title: string;
  subtitle: string;
  sections: { id: string; title: string; content: string }[];
}

export function parsePolicyMarkdown(markdown: string, defaultTitle: string): ParsedPolicy {
  if (!markdown) {
    return { title: defaultTitle, subtitle: '', sections: [] };
  }

  const lines = markdown.split('\n');
  let title = defaultTitle;
  let subtitleLines: string[] = [];
  const sections: { id: string; title: string; content: string }[] = [];
  
  let currentSection: { id: string; title: string; content: string } | null = null;
  let isParsingHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('# ')) {
      title = trimmedLine.replace('# ', '').trim();
      isParsingHeader = true;
      continue;
    }

    if (trimmedLine.startsWith('## ')) {
      isParsingHeader = false;
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentSection.content.trim()
        });
      }
      const sectionTitle = trimmedLine.replace(/^##\s+/, '').trim();
      const id = `sec-${sectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      currentSection = {
        id,
        title: sectionTitle,
        content: ''
      };
      continue;
    }

    if (isParsingHeader) {
      if (trimmedLine && !trimmedLine.toLowerCase().startsWith('last updated:')) {
        subtitleLines.push(trimmedLine);
      }
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentSection.content.trim()
    });
  }

  return {
    title,
    subtitle: subtitleLines.filter(Boolean).join(' '),
    sections
  };
}

export interface ParsedAbout {
  title: string;
  subtitle: string;
  mission: string;
  philosophy: string;
  values: { title: string; desc: string }[];
  milestones: { year: string; title: string; desc: string }[];
}

export function parseAboutMarkdown(markdown: string): ParsedAbout {
  const defaultAbout: ParsedAbout = {
    title: 'About Hector Hosting',
    subtitle: 'Enterprise Hosting. Uncompromising Performance.',
    mission: 'To democratize enterprise-grade computing by delivering uncompromising server infrastructure at accessible prices.',
    philosophy: 'We believe that hosting infrastructure should be "invisible". You focus on your code; we\'ll handle the silicon.',
    values: [
      { title: 'Performance First', desc: 'No CPU overselling. Guaranteed resources.' },
      { title: 'Support that Cares', desc: 'Real human engineers, not bot scripts.' },
      { title: 'Transparent Pricing', desc: 'No hidden renewal fees or setup costs.' }
    ],
    milestones: [
      { year: '2018', title: 'The Genesis', desc: 'Launched first high-clock Ryzen node in Singapore.' },
      { year: '2020', title: 'Global Expansion', desc: 'Expanded infrastructure assets into major US and European datacenters.' },
      { year: '2022', title: '10K Instances Served', desc: 'Reached over 10,000 active virtual environments served.' },
      { year: '2024', title: 'The EPYC Hardware Era', desc: 'Completed hardware-wide transition to enterprise AMD EPYC and Ryzen processors.' }
    ]
  };

  if (!markdown) return defaultAbout;

  const lines = markdown.split('\n');
  let title = defaultAbout.title;
  let subtitleLines: string[] = [];
  let mission = defaultAbout.mission;
  let philosophy = defaultAbout.philosophy;
  const values: { title: string; desc: string }[] = [];
  const milestones: { year: string; title: string; desc: string }[] = [];

  let currentSection = ''; // 'mission', 'philosophy', 'values', 'growth'
  let valuesBlock = '';
  let growthBlock = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      title = trimmed.replace('# ', '').trim();
      currentSection = 'header';
      continue;
    }

    if (trimmed.startsWith('## Our Mission') || trimmed.startsWith('## Mission')) {
      currentSection = 'mission';
      mission = '';
      continue;
    }

    if (trimmed.startsWith('## Our Philosophy') || trimmed.startsWith('## Philosophy')) {
      currentSection = 'philosophy';
      philosophy = '';
      continue;
    }

    if (trimmed.startsWith('### Core Values') || trimmed.startsWith('## Core Values')) {
      currentSection = 'values';
      continue;
    }

    if (trimmed.startsWith('## Our Growth') || trimmed.startsWith('## Growth')) {
      currentSection = 'growth';
      continue;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      currentSection = 'other';
      continue;
    }

    if (currentSection === 'header') {
      if (trimmed) {
        subtitleLines.push(trimmed);
      }
    } else if (currentSection === 'mission') {
      if (trimmed) {
        mission += (mission ? ' ' : '') + trimmed;
      }
    } else if (currentSection === 'philosophy') {
      if (trimmed) {
        philosophy += (philosophy ? ' ' : '') + trimmed;
      }
    } else if (currentSection === 'values') {
      if (trimmed) {
        valuesBlock += trimmed + '\n';
      }
    } else if (currentSection === 'growth') {
      if (trimmed) {
        growthBlock += trimmed + '\n';
      }
    }
  }

  // Parse values (usually numbered or list: "1. **Name:** Desc" or "1. **Name** Desc")
  if (valuesBlock) {
    const valueLines = valuesBlock.split('\n');
    for (const vLine of valueLines) {
      const match = vLine.match(/(?:\d+\.|\*)\s*\*\*(.*?)\*\*[:\s]+(.*)/);
      if (match) {
        values.push({ title: match[1].trim(), desc: match[2].trim() });
      } else {
        const fallbackMatch = vLine.match(/(?:\d+\.|\*)\s*(.*)/);
        if (fallbackMatch && fallbackMatch[1].trim()) {
          const parts = fallbackMatch[1].split(':');
          if (parts.length > 1) {
            values.push({ title: parts[0].trim(), desc: parts.slice(1).join(':').trim() });
          } else {
            values.push({ title: 'Core Value', desc: fallbackMatch[1].trim() });
          }
        }
      }
    }
  }

  // Parse growth/timeline milestones (usually bulleted: "* **2018:** LaunchedSingapore" or "* **2018** Launched Singapore")
  if (growthBlock) {
    const growthLines = growthBlock.split('\n');
    for (const gLine of growthLines) {
      const match = gLine.match(/(?:\d+\.|\*)\s*\*\*(.*?)\*\*[:\s]+(.*)/);
      if (match) {
        const parts = match[2].split(':');
        if (parts.length > 1) {
          milestones.push({ year: match[1].trim(), title: parts[0].trim(), desc: parts.slice(1).join(':').trim() });
        } else {
          milestones.push({ year: match[1].trim(), title: 'Milestone Achievement', desc: match[2].trim() });
        }
      }
    }
  }

  return {
    title,
    subtitle: subtitleLines.join(' '),
    mission: mission || defaultAbout.mission,
    philosophy: philosophy || defaultAbout.philosophy,
    values: values.length > 0 ? values : defaultAbout.values,
    milestones: milestones.length > 0 ? milestones : defaultAbout.milestones
  };
}
