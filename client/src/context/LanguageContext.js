import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
 
const LanguageContext = createContext(null);
 
const translations = {
  ro: {
    nav_feed: 'Feed',
    nav_new_post: 'Postare nouă',
    nav_logout: 'Delogare',
    nav_login: 'Autentificare',
    nav_register: 'Creează cont',
    nav_chatbot: 'Personalizează',
    nav_theme_light: '☀️ Luminos',
    nav_theme_dark: '🌙 Întunecat',
 
    landing_title: 'Berries',
    landing_subtitle: 'O platformă socială diferită, fără algoritmi de manipulat.',
    landing_go_feed: 'Mergi la Feed',
    landing_create_account: 'Creează cont gratuit',
    landing_have_account: 'Am deja un cont',
    landing_feat1_title: 'Zero algoritmi de promovare',
    landing_feat1_desc: 'Conținutul apare cronologic în ordinea postării = fară manipulare artificială.',
    landing_feat2_title: 'Donații crypto',
    landing_feat2_desc: 'Susține creatorii de continut direct cu donații prin blockchain.',
    landing_feat3_title: 'Fără boți (sperăm!)',
    landing_feat3_desc: 'Fără like-uri sau vizualizări = fără motive pentru botting.',
 
    login_title: 'Bine ai revenit',
    login_subtitle: 'Autentifică-te în contul tău Berries',
    login_email: 'Email',
    login_password: 'Parolă',
    login_button: 'Autentificare',
    login_loading: 'Se autentifică...',
    login_no_account: 'Nu ai un cont?',
    login_create: 'Creează cont',
 
    register_title: 'Creează cont',
    register_subtitle: 'Alătură-te comunității Berries',
    register_username: 'Username',
    register_email: 'Email',
    register_password: 'Parolă',
    register_password_hint: 'Minim 6 caractere',
    register_confirm: 'Confirmă parola',
    register_confirm_hint: 'Repetă parola',
    register_button: 'Creează cont',
    register_loading: 'Se creează contul...',
    register_have_account: 'Ai deja un cont?',
    register_login: 'Autentifică-te',
    register_password_mismatch: 'Parolele nu se potrivesc',
    register_password_short: 'Parola trebuie să aibă cel puțin 6 caractere',
 
    feed_title: 'Feed',
    feed_chronological: '↓ Ordine cronologică (de la nou la vechi)',
    feed_empty: 'Nu există postări încă. Fii primul care publică ceva!',
    feed_prev: '← Anterioare',
    feed_next: 'Următoare →',
    feed_filtered_by: 'Personalizat pentru interesele tale',
 
    post_comments: 'Comentarii',
    post_donate: 'Donează',
    post_delete: 'Șterge',
    post_delete_confirm: 'Ești sigur că vrei să ștergi această postare?',
    post_anonymous: 'Anonim',
    post_seconds_ago: 'acum câteva secunde',
    post_minutes_ago: 'acum {n} min',
    post_hours_ago: 'acum {n} ore',
    post_days_ago: 'acum {n} zile',
    post_edit_tags: 'Editează categorii',
    post_add_tags: 'Adaugă categorii',
    post_select_tags: 'Selectează categorii pentru această postare:',
 
    create_title: 'Postare nouă',
    create_placeholder: 'Scrie ce gândești aici...',
    create_what: 'Ce ai de spus?',
    create_image: 'Imagine (opțional)',
    create_image_click: '📷 Click pentru a adăuga o imagine',
    create_image_hint: 'JPG, JPEG, PNG, GIF — max 5MB',
    create_image_remove: '✕ Elimină',
    create_image_too_big: 'Imaginea nu poate depăși 5MB',
    create_empty: 'Scrie ceva în postare',
    create_publish: '✦ Publică postarea',
    create_publishing: 'Se publică...',
    create_cancel: 'Anulează',
 
    post_back: '← Înapoi la Feed',
    post_not_found: 'Postarea nu a fost găsită',
    post_donate_title: 'Donează crypto direct către {username}',
    post_donate_desc: 'Trimite o donație crypto direct în portofelul creatorului.',
    post_donate_soon: '💰 Donează (în curând)',
 
    comments_title: 'Comentarii',
    comments_placeholder: 'Scrie un comentariu...',
    comments_send: 'Trimite',
    comments_login: 'Autentifică-te pentru a lăsa un comentariu.',
    comments_empty: 'Niciun comentariu încă. Fii primul care comentează!',
    comments_delete: 'Șterge',
 
    account_member_since: 'Membru din',
    account_settings: 'Setări profil',
    account_edit: '✎ Editează',
    account_bio: 'Descriere',
    account_bio_placeholder: 'Spune ceva despre tine...',
    account_wallet: 'Adresă portofel crypto',
    account_wallet_hint: 'Adaugă adresa portofelului tău Ethereum pentru a primi donații',
    account_username: 'Username',
    account_profile_pic: 'Poză de profil',
    account_profile_pic_change: '📷 Schimbă poza',
    account_profile_pic_remove: '❌ Șterge poza',
    account_save: 'Salvează',
    account_saving: 'Se salvează...',
    account_cancel: 'Anulează',
    account_updated: 'Profil actualizat cu succes!',
    account_no_bio: 'Nicio descriere adăugată',
    account_no_wallet: 'Niciun portofel crypto adăugat',
    account_my_posts: 'Postările mele',
    account_my_comments: 'Comentariile mele',
    account_no_posts: 'Nu ai publicat nimic încă.',
    account_no_comments: 'Nu ai comentat nimic încă.',
 
    user_posts: 'Postări',
    user_comments: 'Comentarii',
    user_no_posts: 'Acest utilizator nu a publicat nimic încă.',
    user_no_comments: 'Acest utilizator nu a comentat nimic încă.',
    user_not_found: 'Utilizatorul nu a fost găsit',
    user_on_post: 'pe postarea:',

    tag_sport: 'Sport',
    tag_gaming: 'Gaming',
    tag_art: 'Artă',
    tag_movies: 'Filme/Seriale',
    tag_memes: 'Meme-uri',
    tag_technology: 'Tehnologie',
    tag_politics: 'Politică',
    tag_music: 'Muzică',
    tag_food: 'Mâncare',
    tag_travel: 'Călătorii',
    tag_science: 'Știință',
    tag_education: 'Educație',
 
    create_tags: 'Categorii (opțional)',
    create_tags_hint: 'Selectează categorii pentru ca postarea ta să fie mai ușor de găsit',
 
    chatbot_title: 'Personalizează-ți feed-ul',
    chatbot_description: 'Spune-mi ce te interesează și voi arăta postările relevante primele în feed-ul tău. Poți selecta categorii sau scrie liber.',
    chatbot_greeting: 'Salut! 👋 Eu sunt Barry, asistentul tău AI. Dacă vrei, te pot ajuta să îți personalizezi feed-ul :)',
    chatbot_current_interests: 'Interesele tale actuale sunt: {interests}.',
    chatbot_ask: 'Ce te interesează? Poți selecta categorii de mai jos sau scrie liber (de exemplu: "Îmi plac sportul și filmele").',
    chatbot_select_tags: 'Selectează interese:',
    chatbot_found_interests: 'Am înțeles! Am adăugat: {interests}.',
    chatbot_anything_else: 'Mai e ceva care te interesează? Poți selecta mai multe categorii sau scrie.',
    chatbot_not_understood: 'Nu am recunoscut un interes specific. Încearcă să selectezi din categoriile de mai jos, sau scrie cuvinte cheie simple ("sport", "filme", "muzica" etc.)',
    chatbot_save_interests: 'Salvează interesele',
    chatbot_clear: 'Resetează',
    chatbot_saved: 'Gata! Feed-ul tău va arăta mai întâi postările despre: {interests}. Restul postărilor vor apărea după, tot cronologic.',
    chatbot_saved_empty: 'Am șters toate interesele. Feed-ul tău va fi pur cronologic.',
    chatbot_saved_confirmation: 'Salvat!',
    chatbot_active_interests: 'Interese active:',
    chatbot_input_placeholder: 'Scrie ce te interesează...',
 
    footer_text: '2026 - Berries',
 
    not_found: 'Pagina nu a fost găsită',
 
    lang_switch: '🇬🇧 English',
 
    err_username_required: 'Username-ul este obligatoriu',
    err_username_min: 'Username-ul trebuie să aibă cel puțin 3 caractere',
    err_username_max: 'Username-ul nu poate depăși 30 de caractere',
    err_email_required: 'Email-ul este obligatoriu',
    err_email_invalid: 'Adresa de email nu este validă',
    err_password_required: 'Parola este obligatorie',
    err_password_min: 'Parola trebuie să aibă cel puțin 6 caractere',
    err_bio_max: 'Descrierea nu poate depăși 300 de caractere',
    err_email_taken: 'Un cont cu acest email există deja',
    err_username_taken: 'Acest username este deja folosit',
    err_email_password: 'Email sau parolă incorectă',
    err_auth_required: 'Autentificare necesară',
    err_user_not_found: 'Utilizator negăsit',
    err_token_invalid: 'Token invalid sau expirat',
    err_no_image: 'Nicio imagine selectată',
    err_image_only: 'Doar fișiere de tip imagine sunt permise (JPG, JPEG, PNG, GIF)',
    err_post_content_required: 'Conținutul postării este obligatoriu',
    err_post_content_max: 'Postarea nu poate depăși 5000 de caractere',
    err_post_not_found: 'Postarea nu a fost găsită',
    err_not_authorized_post: 'Nu ai permisiunea de a șterge această postare',
    err_comment_content_required: 'Conținutul comentariului este obligatoriu',
    err_comment_content_max: 'Comentariul nu poate depăși 1000 de caractere',
    err_comment_not_found: 'Comentariul nu a fost găsit',
    err_not_authorized_comment: 'Nu ai permisiunea de a șterge acest comentariu',
    err_server_register: 'Eroare la crearea contului',
    err_server_login: 'Eroare la autentificare',
    err_server_profile: 'Eroare la încărcarea profilului',
    err_server_update_profile: 'Eroare la actualizarea profilului',
    err_server_upload_image: 'Eroare la încărcarea imaginii',
    err_server_delete_image: 'Eroare la ștergerea imaginii',
    err_server_delete_account: 'Eroare la ștergerea contului',
    err_server_load_posts: 'Eroare la încărcarea postărilor',
    err_server_load_post: 'Eroare la încărcarea postării',
    err_server_create_post: 'Eroare la crearea postării',
    err_server_delete_post: 'Eroare la ștergerea postării',
    err_server_add_comment: 'Eroare la adăugarea comentariului',
    err_server_load_comments: 'Eroare la încărcarea comentariilor',
    err_server_delete_comment: 'Eroare la ștergerea comentariului',
    err_server_update_post: 'Eroare la actualizarea postării',
    err_invalid: 'Format invalid',
  },
 
  en: {
    nav_feed: 'Feed',
    nav_new_post: 'New Post',
    nav_logout: 'Log out',
    nav_login: 'Log in',
    nav_register: 'Sign up',
    nav_chatbot: 'Customize',
    nav_theme_light: '☀️ Light',
    nav_theme_dark: '🌙 Dark',
 
    landing_title: 'Berries',
    landing_subtitle: 'A different kind of social platform, with no algorithms to manipulate.',
    landing_go_feed: 'Go to Feed',
    landing_create_account: 'Create free account',
    landing_have_account: 'I already have an account',
    landing_feat1_title: 'No promotion algorithms',
    landing_feat1_desc: 'Posts appear chronologically in the order they are posted = no artificial manipulation.',
    landing_feat2_title: 'Crypto donations',
    landing_feat2_desc: 'Support content creators through donations directly to their crypto wallets.',
    landing_feat3_title: 'No bots (hopefully!)',
    landing_feat3_desc: 'No likes or views = no incentive for botting.',
 
    login_title: 'Welcome back',
    login_subtitle: 'Log in to your Berries account',
    login_email: 'Email',
    login_password: 'Password',
    login_button: 'Log in',
    login_loading: 'Logging in...',
    login_no_account: "Don't have an account?",
    login_create: 'Sign up',
 
    register_title: 'Create account',
    register_subtitle: 'Join the Berries community',
    register_username: 'Username',
    register_email: 'Email',
    register_password: 'Password',
    register_password_hint: 'At least 6 characters',
    register_confirm: 'Confirm password',
    register_confirm_hint: 'Repeat password',
    register_button: 'Create account',
    register_loading: 'Creating account...',
    register_have_account: 'Already have an account?',
    register_login: 'Log in',
    register_password_mismatch: 'Passwords do not match',
    register_password_short: 'Password must be at least 6 characters',
 
    feed_title: 'Feed',
    feed_chronological: '↓ Chronological order (from new to old)',
    feed_empty: 'No posts yet. Be the first to publish something!',
    feed_prev: '← Previous',
    feed_next: 'Next →',
    feed_filtered_by: 'Personalized for your interests',
 
    post_comments: 'Comments',
    post_donate: 'Donate',
    post_delete: 'Delete',
    post_delete_confirm: 'Are you sure you want to delete this post?',
    post_anonymous: 'Anonymous',
    post_seconds_ago: 'just now',
    post_minutes_ago: '{n} min ago',
    post_hours_ago: '{n} hours ago',
    post_days_ago: '{n} days ago',
    post_edit_tags: 'Edit categories',
    post_add_tags: 'Add categories',
    post_select_tags: 'Select categories for this post:',

    create_title: 'New post',
    create_placeholder: 'Write your thoughts here...',
    create_what: 'What do you have to say?',
    create_image: 'Image (optional)',
    create_image_click: '📷 Click to add an image',
    create_image_hint: 'JPG, JPEG, PNG, GIF — max 5MB',
    create_image_remove: '✕ Remove',
    create_image_too_big: 'Image cannot exceed 5MB',
    create_empty: 'Write something in your post',
    create_publish: '✦ Publish post',
    create_publishing: 'Publishing...',
    create_cancel: 'Cancel',
 
    post_back: '← Back to Feed',
    post_not_found: 'Post not found',
    post_donate_title: 'Donate crypto directly to {username}',
    post_donate_desc: 'Send a crypto donation directly to the creator\'s wallet.',
    post_donate_soon: '💰 Donate (coming soon)',
 
    comments_title: 'Comments',
    comments_placeholder: 'Write a comment...',
    comments_send: 'Send',
    comments_login: 'Log in to leave a comment.',
    comments_empty: 'No comments yet. Be the first to comment!',
    comments_delete: 'Delete',
 
    account_member_since: 'Member since',
    account_settings: 'Profile settings',
    account_edit: '✎ Edit',
    account_bio: 'Bio',
    account_bio_placeholder: 'Tell something about yourself...',
    account_wallet: 'Crypto wallet address',
    account_wallet_hint: 'Add your Ethereum wallet address to receive donations',
    account_username: 'Username',
    account_profile_pic: 'Profile picture',
    account_profile_pic_change: '📷 Change photo',
    account_profile_pic_remove: '❌ Remove photo',
    account_save: 'Save',
    account_saving: 'Saving...',
    account_cancel: 'Cancel',
    account_updated: 'Profile updated successfully!',
    account_no_bio: 'No bio added',
    account_no_wallet: 'No crypto wallet added',
    account_my_posts: 'My Posts',
    account_my_comments: 'My Comments',
    account_no_posts: "You haven't published anything yet.",
    account_no_comments: "You haven't commented on anything yet.",
 
    user_posts: 'Posts',
    user_comments: 'Comments',
    user_no_posts: "This user hasn't published anything yet.",
    user_no_comments: "This user hasn't commented on anything yet.",
    user_not_found: 'User not found',
    user_on_post: 'on post:',
 
    tag_sport: 'Sport',
    tag_gaming: 'Gaming',
    tag_art: 'Art',
    tag_movies: 'Movies/TV Shows',
    tag_memes: 'Memes',
    tag_technology: 'Technology',
    tag_politics: 'Politics',
    tag_music: 'Music',
    tag_food: 'Food',
    tag_travel: 'Travel',
    tag_science: 'Science',
    tag_education: 'Education',
 
    create_tags: 'Categories (optional)',
    create_tags_hint: 'Select categories so your post is easier to discover',
 
    chatbot_title: 'Personalize your feed',
    chatbot_description: 'Tell me what interests you and I will show relevant posts first in your feed. You can select categories or type freely.',
    chatbot_greeting: 'Hi! 👋 I\'m Barry, your AI assistant. If you want, I can help you personalize your feed :)',
    chatbot_current_interests: 'Your current interests are: {interests}.',
    chatbot_ask: 'What are you interested in? You can select categories below or type freely (e.g. "I like sports and movies").',
    chatbot_select_tags: 'Select interests:',
    chatbot_found_interests: 'Got it! I added: {interests}.',
    chatbot_anything_else: 'Anything else you are interested in? You can select more categories or type.',
    chatbot_not_understood: 'I did not recognize a specific interest. Try selecting from the categories below, or type simple keywords ("sport", "movies", "music" etc.)',
    chatbot_save_interests: 'Save interests',
    chatbot_clear: 'Reset',
    chatbot_saved: 'Done! Your feed will show posts about {interests} first. The rest will appear after, still chronologically.',
    chatbot_saved_empty: 'All interests cleared. Your feed will be purely chronological.',
    chatbot_saved_confirmation: 'Saved!',
    chatbot_active_interests: 'Active interests:',
    chatbot_input_placeholder: 'Type what interests you...',
 
    footer_text: '2026 - Berries',
 
    not_found: 'Page not found',
 
    lang_switch: '🇷🇴 Română',
 
    err_username_required: 'Username is required',
    err_username_min: 'Username must be at least 3 characters',
    err_username_max: 'Username cannot exceed 30 characters',
    err_email_required: 'Email is required',
    err_email_invalid: 'Email address is not valid',
    err_password_required: 'Password is required',
    err_password_min: 'Password must be at least 6 characters',
    err_bio_max: 'Bio cannot exceed 300 characters',
    err_email_taken: 'An account with this email already exists',
    err_username_taken: 'This username is already taken',
    err_email_password: 'Incorrect email or password',
    err_auth_required: 'Authentication required',
    err_user_not_found: 'User not found',
    err_token_invalid: 'Invalid or expired token',
    err_no_image: 'No image selected',
    err_image_only: 'Only image files are allowed (JPG, JPEG, PNG, GIF)',
    err_post_content_required: 'Post content is required',
    err_post_content_max: 'Post cannot exceed 5000 characters',
    err_post_not_found: 'Post not found',
    err_not_authorized_post: 'You are not authorized to delete this post',
    err_comment_content_required: 'Comment content is required',
    err_comment_content_max: 'Comment cannot exceed 1000 characters',
    err_comment_not_found: 'Comment not found',
    err_not_authorized_comment: 'You are not authorized to delete this comment',
    err_server_register: 'Error creating account',
    err_server_login: 'Error logging in',
    err_server_profile: 'Error loading profile',
    err_server_update_profile: 'Error updating profile',
    err_server_upload_image: 'Error uploading image',
    err_server_delete_image: 'Error deleting image',
    err_server_delete_account: 'Error deleting account',
    err_server_load_posts: 'Error loading posts',
    err_server_load_post: 'Error loading post',
    err_server_create_post: 'Error creating post',
    err_server_delete_post: 'Error deleting post',
    err_server_add_comment: 'Error adding comment',
    err_server_load_comments: 'Error loading comments',
    err_server_delete_comment: 'Error deleting comment',
    err_server_update_post: 'Error updating post',
    err_invalid: 'Invalid format',
  }
};
 
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('berries_lang') || 'ro';
  });
 
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('berries_theme') || 'light';
  });
 
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
 
  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'ro' ? 'en' : 'ro';
      localStorage.setItem('berries_lang', next);
      return next;
    });
  }, []);
 
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('berries_theme', next);
      return next;
    });
  }, []);
 
  const t = useCallback((key, params = {}) => {
    if (!key) return '';
    // Pt erori multiple
    if (key.includes('. ')) {
      return key.split('. ').map(k => {
        let text = translations[lang]?.[k.trim()] || translations['ro']?.[k.trim()] || k.trim();
        Object.entries(params).forEach(([pk, pv]) => {
          text = text.replace(`{${pk}}`, pv);
        });
        return text;
      }).join('. ');
    }
    let text = translations[lang]?.[key] || translations['ro']?.[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  }, [lang]);
 
  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
}
 
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}