import rawStyle from './test2style.css?raw';

const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const pages = ref([]);

    // Generate content for pages
    function generateContent() {
      // Simulated content for demonstration
      const content = [
        "<h1>Page 1</h1><p>This is content for page 1.</p>",
        "<h1>Page 2</h1><p>This is content for page 2.</p>",
        "<h1>Page 3</h1><p>This is content for page 3.</p>"
      ];
      pages.value = content;
    }
    generateContent();
    onMounted(() => {
      console.log('mounted');
      let newstyle = document.createElement('style');
      newstyle.innerHTML = rawStyle;
      document.getElementsByTagName('head')[0].appendChild(newstyle);  
    });

    return {
      pages,
    };
  }
});

app.mount('#app');
