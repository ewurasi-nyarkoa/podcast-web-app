export interface EpisodesResponse {
    status: string;
    data:   Episode[];
    meta:   Meta;
}

export interface Episode {
    id:                 number;
    title:              string;
    description:        string;
    img_url:            string;
    audio_url:          string;
    duration:           string;
    posted_on:          Date;
    season:             number;
    episode:            number;
    spotify_url:        string;
    apple_podcasts_url: string;
    archive:            number;
    featured:           number;
    slug:               string;
    created_at:         Date;
    updated_at:         Date;
}

export interface Meta {
    total:     number;
    page:      number;
    last_page: number;
}
