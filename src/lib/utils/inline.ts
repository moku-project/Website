export function renderInline(text: string): string {
	return text
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
			const external = /^https?:\/\//.test(href);
			return external
				? `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`
				: `<a href="${href}">${label}</a>`;
		});
}
