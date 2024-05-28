export const emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

export const ROUTES = {
	login: '/auth/sign-in',
	landingGatheringCenter: '/landing/gathering-center',
	summary: '/dashboard/summary',
};

export const DOCUMENT_TYPE =  {
	pdf: 'application/pdf',
	excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}