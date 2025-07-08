export interface confession {
    id:          number;
    message:     string;
    category:    string;
    emotion:     string;
    is_approved: boolean;
    created_at:  Date;
    updated_at:  Date;
}