export const staticStyles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:root {
    --primary: rgb(44 62 80);
    --secondary: rgb(52 152 219);
    --accent: rgb(231 76 60);
    --light: rgb(236 240 241);
    --dark: rgb(44 62 80);
    --text: rgb(52 73 94);
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
    background-color: rgb(245 247 250);
    color: var(--text);
    line-height: 1.6;
    padding: 0;
}

.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 15px;
}

.article-header {
    padding: 30px 0 20px;
    text-align: center;
}

.article-title {
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.2;
}

.article-meta {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 0.9rem;
    color: rgb(127 140 141);
    margin-bottom: 20px;
}

.article-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.article-content {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow);
    margin-bottom: 30px;
}

.article-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.article-body {
    padding: 25px 20px;
}

.article h2 {
    color: var(--primary);
    margin: 25px 0 15px;
    font-size: 1.5rem;
    border-left: 4px solid var(--secondary);
    padding-left: 15px;
}

.article h3 {
    color: var(--primary);
    margin: 20px 0 10px;
    font-size: 1.3rem;
}

.article p {
    margin-bottom: 20px;
    font-size: 1rem;
}

.image-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 25px 0;
}

.image-grid img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s;
}

.image-grid img:hover {
    transform: scale(1.02);
}

.caption {
    font-style: italic;
    font-size: 0.85rem;
    color: rgb(127 140 141);
    text-align: center;
    margin-top: 5px;
}

.quote {
    background: linear-gradient(to right, var(--light), white);
    border-left: 5px solid var(--secondary);
    padding: 20px;
    margin: 25px 0;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--primary);
    border-radius: 0 8px 8px 0;
}

.sidebar {
    display: none;
}

.back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--secondary);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: var(--shadow);
    z-index: 99;
    opacity: 0;
    transition: opacity 0.3s;
}

.back-to-top.visible {
    opacity: 1;
}

@media (min-width: 768px) {
    .container {
        padding: 0 20px;
    }
    
    .article-title {
        font-size: 2.5rem;
    }
    
    .article-image {
        height: 350px;
    }
    
    .article-body {
        padding: 30px;
    }
    
    .image-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .image-grid img {
        height: 220px;
    }
    
    .blog-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        margin-bottom: 40px;
    }
    
    .sidebar {
        display: block;
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: var(--shadow);
        height: fit-content;
        position: sticky;
        top: 20px;
    }
    
    .sidebar h3 {
        color: var(--primary);
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--light);
    }
    
    .author-info {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
    }
    
    .author-avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 15px;
    }
    
    .related-article {
        display: flex;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--light);
    }
    
    .related-article img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 5px;
        margin-right: 15px;
    }
    
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
    }
    
    .tag {
        background-color: var(--light);
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.85rem;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
    
    .article-title {
        font-size: 3rem;
    }
    
    .article-image {
        height: 400px;
    }
    
    .article-body {
        padding: 40px;
    }
    
    .image-grid img {
        height: 250px;
    }
}

@media (min-width: 1200px) {
    .article-body {
        padding: 40px 50px;
    }
}

@media (prefers-color-scheme: dark) {
    :root {
        --primary: rgb(209 213 219);
        --secondary: rgb(59 130 246);
        --accent: rgb(239 68 68);
        --light: rgb(55 65 81);
        --dark: rgb(249 250 251);
        --text: rgb(209 213 219);
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
    }

    body {
        background-color: rgb(17 24 39);
    }

    .article-content, .sidebar {
        background: rgb(31 41 55);
        border: 1px solid rgb(55 65 81);
    }

    .sidebar {
        background: rgb(31 41 55);
    }

    .article-meta, .caption {
        color: rgb(156 163 175);
    }

    .quote {
        background: linear-gradient(to right, rgb(31 41 55), rgb(17 24 39));
        border-left-color: var(--secondary);
        color: var(--text);
    }

    .sidebar h3 {
        border-bottom-color: var(--light);
    }

    .related-article {
        border-bottom-color: var(--light);
    }

    .tag {
        background-color: var(--light);
        color: var(--dark);
    }
}
`;

export const staticHtmlContent = `
<div class="container">
    <div class="article-header">
        <h1 class="article-title">The Sydney Opera House: An Architectural Masterpiece</h1>
        <div class="article-meta">
            <span><i class="far fa-calendar"></i> June 15, 2023</span>
            <span><i class="far fa-clock"></i> 8 min read</span>
            <span><i class="far fa-user"></i> Michael Anderson</span>
        </div>
    </div>

    <div class="blog-layout">
        <main class="article-content">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Sydney Opera House" class="article-image">
            
            <div class="article-body">
                <p>The Sydney Opera House is more than just an iconic building; it\'s a symbol of architectural ambition and innovation. Situated on Bennelong Point in Sydney Harbour, this UNESCO World Heritage Site attracts millions of visitors each year, not just for performances but to marvel at its unique design.</p>
                
                <h2>The Visionary Design</h2>
                <p>Danish architect Jørn Utzon\'s winning design in the 1956 international competition was revolutionary. His concept of shell-like structures was unlike anything seen before in large-scale architecture. The design was inspired by natural forms - segments of oranges, palm fronds, and even sailing ships.</p>
                
                <div class="image-grid">
                    <div>
                        <img src="https://www.thoughtco.com/thmb/EqvppJfCaMdj4H3ba1PmdYCjuR4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/utzonSOH-821907-56aadd173df78cf772b49827.jpg" alt="Opera House shells">
                        <p class="caption">The iconic shell structure of the Opera House</p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1540448051910-09cfadd5df61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Opera House interior">
                        <p class="caption">The stunning interior of the Concert Hall</p>
                    </div>
                </div>
                
                <h2>Engineering Challenges</h2>
                <p>The construction of the Opera House presented unprecedented engineering challenges. The original shell design proved mathematically impossible to build, requiring Utzon to develop a solution where all shells would be created from sections of a sphere. This innovative approach allowed for the prefabrication of components, though it still required complex calculations and precise execution.</p>
                
                <p>The project faced numerous setbacks, including budget overruns and technical difficulties. The original estimated cost of $7 million ballooned to over $100 million by completion in 1973, a decade later than initially planned.</p>
                
                <div class="quote">
                    "The Sydney Opera House is a great architectural work of the 20th century. It represents multiple strands of creativity, both in architectural form and structural design."
                </div>
                
                <h2>Architectural Significance</h2>
                <p>Utzon\'s design broke away from the rectangular, International Style boxes that dominated modern architecture. The flowing, organic forms created a building that appears to change shape from different viewpoints, engaging dynamically with its harbor setting.</p>
                
                <img src="https://images.unsplash.com/photo-1565194388949-64569b118e53?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Opera House at night" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin: 20px 0;">
                <p class="caption">The Opera House illuminated at night against the Sydney skyline</p>
                
                <h3>Key Design Elements</h3>
                <p>The building comprises three groups of interlocking vaulted \'shells\' which roof two main performance halls and a restaurant. These shell structures are set upon a vast platform and surrounded by terrace areas that function as pedestrian concourses.</p>
                
                <p>The design successfully integrates various performing arts venues into a single architectural composition while maintaining their individual identities. The largest shell houses the Concert Hall, with excellent acoustics achieved through careful design of the interior surfaces.</p>
                
                <h2>Legacy and Influence</h2>
                <p>The Sydney Opera House has become one of the most recognizable buildings of the 20th century and a symbol of both Sydney and Australia. Its design has influenced architects worldwide, demonstrating how expressive forms could be achieved through modern construction techniques.</p>
                
                <p>Despite the controversies during its construction, the Opera House stands as a testament to architectural vision and perseverance. It continues to inspire architects and delight visitors, securing its place as one of the great architectural achievements in modern history.</p>
                
                <div class="image-grid">
                    <div>
                        <img src="https://www.shutterstock.com/image-photo/sydney-harbour-opera-house-cityscape-260nw-2495680553.jpg" alt="Opera House from water">
                        <p class="caption">View of the Opera House from the water</p>
                    </div>
                    <div>
                        <img src="https://media.licdn.com/dms/image/v2/D5612AQGCf_g0RcyY_Q/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1690174056545?e=1759968000&v=beta&t=K3gulPsK74Yu5xrwicmdhLheSmLU4Vk7NKXW_AQz6-o" alt="Opera House details">
                        <p class="caption">Detailed view of the tile work on the shells</p>
                    </div>
                </div>
            </div>
        </main>
        
        <aside class="sidebar">
            <div class="author-info">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Author" class="author-avatar">
                <div>
                    <h3>Michael Anderson</h3>
                    <p>Architectural Historian</p>
                </div>
            </div>
            
            <h3>About the Author</h3>
            <p>Michael is an architectural historian with over 15 years of experience studying modernist architecture. He has published several books on 20th-century architectural landmarks.</p>
            
            <h3>Related Articles</h3>
            <div class="related-article">
                <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Related article">
                <div>
                    <h4>Frank Gehry\'s Guggenheim Museum</h4>
                    <p>Exploring the deconstructivist masterpiece in Bilbao</p>
                </div>
            </div>
            
            <div class="related-article">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Related article">
                <div>
                    <h4>The Evolution of Skyscraper Design</h4>
                    <p>From early steel frames to sustainable towers</p>
                </div>
            </div>
            
            <h3>Article Tags</h3>
            <div class="tags">
                <span class="tag">Architecture</span>
                <span class="tag">Modernism</span>
                <span class="tag">Design</span>
                <span class="tag">Sydney</span>
                <span class="tag">UNESCO</span>
                <span class="tag">Engineering</span>
            </div>
        </aside>
    </div>
</div>
`;
