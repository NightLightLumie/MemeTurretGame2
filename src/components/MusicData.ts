const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 0.424,
		bpm: 60,
	},
	m_first: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_draw: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_end: {
		offset: 0,
		bpm: 0,
		loop: false,
	},
	m_shop: {
		offset: 41860 / 48000,
		bpm: 86,
		loop: true,
		start: 41860 / 48000 + overlap,
		end: 2854884 / 48000 + overlap,
	},
	m_gameover:{
		offset: 0,
		bpm: 206,
		start: 0,
		end: 3036160 / 44100,
	},
	m_lv1: {
		offset: 0,
		bpm:206,
		loop: true,
		start: 0,
		end: 8743936 / 44100,
	},
	m_lv2: {
		offset: 0,
		bpm: 206,
		loop: true,
		start: 0,
		end: 11948032 / 44100,

	}
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
	};
};

export default Data as MusicDataType;
