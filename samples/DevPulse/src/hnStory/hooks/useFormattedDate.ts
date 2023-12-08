export const intlFormatDate = (d: Date | null | undefined): string => {
	if (!d) {
		return "Invalid Date";
	}
	return new Intl.DateTimeFormat(navigator.language, { dateStyle: "medium" }).format(new Date(d));
};
