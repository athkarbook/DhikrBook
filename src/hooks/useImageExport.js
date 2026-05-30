import html2canvas from 'html2canvas';

export function useImageExport(setIsExporting, isDarkMode) {
  const exportStatsAsImage = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      const element = document.getElementById('stats-export-area');
      if (!element) return setIsExporting(false);
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          scale: 2
        });
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `DhikrBook-Stats-\${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataURL;
        link.click();
      } catch (e) {
        console.error("Export failed:", e);
      } finally {
        setIsExporting(false);
      }
    }, 200);
  };

  const exportStoryAsImage = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('story-export-card');
      const parent = element.parentElement;
      if (!element || !parent) return setIsExporting(false);

      // إظهار العنصر مؤقتاً للتصوير
      parent.style.left = '0';

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 1,
        useCORS: true
      });

      // إعادة إخفاء العنصر
      parent.style.left = '-9999px';

      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `DhikrBook-Story-\${new Date().toISOString().slice(0, 10)}.jpg`;
      link.href = dataURL;
      link.click();
    } catch (e) {
      console.error('Story export failed:', e);
      alert('حدث خطأ أثناء تصدير الصورة.');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportStatsAsImage, exportStoryAsImage };
}
