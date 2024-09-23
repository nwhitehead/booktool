import matter from 'gray-matter';

export const frontmatterPlugin = (
    md,
    { grayMatterOptions } = {},
) => {
    const render = md.render.bind(md);
    md.render = (src, env = {}) => {
        // Clear gray-matter cache to avoid https://github.com/jonschlinkert/gray-matter/issues/174
        matter.clearCache();
        const res = matter(src, grayMatterOptions);
        env.content = res.content;
        if (res.matter) {
            // Pad out content with blank space for parsed frontmatter so that line numbers match up exactly with source
            // .matter does not include delimeters but does include newlines
            const frontmatterLineCount = res.matter.split(/\r\n|\r|\n/).length + 1;
            env.content = '\n'.repeat(frontmatterLineCount) + env.content;
        }
        env.frontmatter = {
            ...env.frontmatter,
            ...res.data,
        };
        return render(env.content, env);
    };
};
