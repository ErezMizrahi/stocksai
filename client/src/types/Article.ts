export interface Article {
    Author: string;
    Content: string;
    CreatedAt: string;
    Headline: string;
    ID: string;
    Images: ArticleImage[];
    Source: string;
    Summary: string;
    Symbols: string[];
    UpdatedAt: string;
    URL: string;
}

export interface ArticleImage {
    size: string;
    url: string;
}