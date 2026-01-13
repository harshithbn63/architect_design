import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
    flowchart: {
        htmlLabels: false,
        useMaxWidth: true,
        curve: 'basis'
    },
    themeVariables: {
        primaryColor: '#ef4444',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#f87171',
        lineColor: '#ef4444',
        secondaryColor: '#1a1a1a',
        tertiaryColor: '#0a0a0a',
        background: '#000000',
        mainBkg: '#1a1a1a',
        nodeBorder: '#f87171',
        clusterBkg: '#1a1a1a',
        titleColor: '#ffffff',
        edgeLabelBackground: '#1a1a1a'
    }
});

interface Props {
    chart: string;
}

function sanitizeMermaid(input: string): string {
    if (!input) return '';

    let s = input.trim();

    // Remove code fences
    s = s.replace(/^```mermaid\s*/i, '').replace(/```\s*$/i, '');

    // Convert literal \n to newlines
    s = s.replace(/\\n/g, '\n');

    // CRITICAL: Replace ALL semicolons with newlines
    s = s.split(';').join('\n');

    // Remove pipe labels: -->|text| becomes -->
    s = s.replace(/-->\|[^|]+\|/g, '-->');
    s = s.replace(/---\|[^|]+\|/g, '---');

    // Fix parentheses in labels: [Text (Sub)] -> [Text - Sub]
    s = s.replace(/\(([^)]+)\)/g, '- $1');

    // Clean empty lines
    s = s.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');

    // Ensure graph declaration
    if (!s.toLowerCase().startsWith('graph') && !s.toLowerCase().startsWith('flowchart')) {
        s = 'graph TD\n' + s;
    }

    return s;
}

export const MermaidVisualizer: React.FC<Props> = ({ chart }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chart) {
            setLoading(false);
            return;
        }

        const render = async () => {
            setLoading(true);
            setError('');

            try {
                const clean = sanitizeMermaid(chart);
                console.log('MERMAID INPUT:', clean);

                const { svg: result } = await mermaid.render(`m${Date.now()}`, clean);
                setSvg(result);
            } catch (e: any) {
                console.error('MERMAID ERROR:', e);
                setError(e?.message || 'Render failed');
            }

            setLoading(false);
        };

        render();
    }, [chart]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-black rounded-xl min-h-[180px]">
                <RefreshCw className="w-5 h-5 animate-spin text-red-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-black rounded-xl border border-red-500/30 min-h-[120px]">
                <div className="flex items-center gap-2 text-red-400 text-xs mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Diagram Error
                </div>
                <pre className="text-[10px] text-slate-600 overflow-auto max-h-20">{chart}</pre>
            </div>
        );
    }

    if (!svg) {
        return (
            <div className="flex items-center justify-center p-8 bg-black rounded-xl min-h-[120px] text-slate-600 text-sm">
                No diagram
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto p-6 bg-black rounded-xl min-h-[350px] flex justify-center items-center">
            <div
                style={{ transform: 'scale(1.75)', transformOrigin: 'center' }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
};
