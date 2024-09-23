import matter from 'gray-matter';

export const frontmatterPlugin = (
    md,
    { grayMatterOptions } = {},
) => {
    const render = md.render.bind(md);
    md.render = (src, env = {}) => {
        const res = matter(src, grayMatterOptions);
        env.content = res.content;
        env.frontmatter = {
            ...env.frontmatter,
            ...res.data,
        };
        env.matter = res.matter;
        return render(res.content, env);
    };
};
