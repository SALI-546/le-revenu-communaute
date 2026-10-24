export const THEME_KEY = 'theme';
export const DENSITY_KEY = 'density';

export const preferencesScript = `try{var d=document.documentElement;d.classList.toggle('dark',localStorage.getItem('${THEME_KEY}')==='dark');if(localStorage.getItem('${DENSITY_KEY}')==='compact')d.dataset.density='compact'}catch(e){}`;

export const savePreference = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
