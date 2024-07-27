document.addEventListener('DOMContentLoaded', function() {
    const languageSelect1 = document.getElementById('language1');
    const languageSelect2 = document.getElementById('language2');
    const translateButton = document.getElementById('submit');
    const firstTextArea = document.getElementById('first');
    const secondTextArea = document.getElementById('second');
    const error = document.getElementById('error');

    const language = {
        "am-ET": "Amharic",
        "ar-SA": "Arabic",
        "be-BY": "Bielarus",
        "bem-ZM": "Bemba",
        "bi-VU": "Bislama",
        "bjs-BB": "Bajan",
        "bn-IN": "Bengali",
        "bo-CN": "Tibetan",
        "br-FR": "Breton",
        "bs-BA": "Bosnian",
        "ca-ES": "Catalan",
        "cop-EG": "Coptic",
        "cs-CZ": "Czech",
        "cy-GB": "Welsh",
        "da-DK": "Danish",
        "dz-BT": "Dzongkha",
        "de-DE": "German",
        "dv-MV": "Maldivian",
        "el-GR": "Greek",
        "en-GB": "English",
        "es-ES": "Spanish",
        "et-EE": "Estonian",
        "eu-ES": "Basque",
        "fa-IR": "Persian",
        "fi-FI": "Finnish",
        "fn-FNG": "Fanagalo",
        "fo-FO": "Faroese",
        "fr-FR": "French",
        "gl-ES": "Galician",
        "gu-IN": "Gujarati",
        "ha-NE": "Hausa",
        "he-IL": "Hebrew",
        "hi-IN": "Hindi",
        "hr-HR": "Croatian",
        "hu-HU": "Hungarian",
        "id-ID": "Indonesian",
        "is-IS": "Icelandic",
        "it-IT": "Italian",
        "ja-JP": "Japanese",
        "kk-KZ": "Kazakh",
        "km-KM": "Khmer",
        "kn-IN": "Kannada",
        "ko-KR": "Korean",
        "ku-TR": "Kurdish",
        "ky-KG": "Kyrgyz",
        "la-VA": "Latin",
        "lo-LA": "Lao",
        "lv-LV": "Latvian",
        "men-SL": "Mende",
        "mg-MG": "Malagasy",
        "mi-NZ": "Maori",
        "ms-MY": "Malay",
        "mt-MT": "Maltese",
        "my-MM": "Burmese",
        "ne-NP": "Nepali",
        "niu-NU": "Niuean",
        "nl-NL": "Dutch",
        "no-NO": "Norwegian",
        "ny-MW": "Nyanja",
        "ur-PK": "Pakistani",
        "pau-PW": "Palauan",
        "pa-IN": "Panjabi",
        "ps-PK": "Pashto",
        "pis-SB": "Pijin",
        "pl-PL": "Polish",
        "pt-PT": "Portuguese",
        "rn-BI": "Kirundi",
        "ro-RO": "Romanian",
        "ru-RU": "Russian",
        "sg-CF": "Sango",
        "si-LK": "Sinhala",
        "sk-SK": "Slovak",
        "sm-WS": "Samoan",
        "sn-ZW": "Shona",
        "so-SO": "Somali",
        "sq-AL": "Albanian",
        "sr-RS": "Serbian",
        "sv-SE": "Swedish",
        "sw-SZ": "Swahili",
        "ta-LK": "Tamil",
        "te-IN": "Telugu",
        "tet-TL": "Tetum",
        "tg-TJ": "Tajik",
        "th-TH": "Thai",
        "ti-TI": "Tigrinya",
        "tk-TM": "Turkmen",
        "tl-PH": "Tagalog",
        "tn-BW": "Tswana",
        "to-TO": "Tongan",
        "tr-TR": "Turkish",
        "uk-UA": "Ukrainian",
        "uz-UZ": "Uzbek",
        "vi-VN": "Vietnamese",
        "wo-SN": "Wolof",
        "xh-ZA": "Xhosa",
        "yi-YD": "Yiddish",
        "zu-ZA": "Zulu"
    };

    function populateLanguageSelect(selectElement) {
        for (const [code, name] of Object.entries(language)) {
            const option = document.createElement('option');
            option.value = code;
            option.text = name;
            selectElement.appendChild(option);
        }
    }

    populateLanguageSelect(languageSelect1);
    populateLanguageSelect(languageSelect2);

    translateButton.addEventListener('click', () => {
        const textToTranslate = firstTextArea.value;
        if (textToTranslate === "") {
            error.innerHTML = "Input field is empty";
            setTimeout(() => { error.innerHTML = ""; }, 5000);
            return;
        }

        const language1 = languageSelect1.value.split('-')[0];
        const language2 = languageSelect2.value.split('-')[0];

        if (language1 === language2) {
            error.innerHTML = "Please select different languages";
            setTimeout(() => { error.innerHTML = ""; }, 5000);
            return;
        }

        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${language1}|${language2}`)
            .then((response) => response.json())
            .then((data) => {
                secondTextArea.value = data.responseData.translatedText;
                secondTextArea.style.cssText = "background-color:rgb(240, 240, 240);";

                // Remove existing icons if present
                const existingCopyIcon = document.querySelector('.copy-icon');
                if (existingCopyIcon) existingCopyIcon.remove();

                const existingAudioIcon = document.querySelector('.audio-icon');
                if (existingAudioIcon) existingAudioIcon.remove();

                // Add copy icon
                const copyIcon = document.createElement('img');
                copyIcon.src = 'copy.png';
                copyIcon.alt = 'copy';
                copyIcon.className = 'copy-icon';
                secondTextArea.parentElement.appendChild(copyIcon);

                copyIcon.addEventListener('click', () => {
                    navigator.clipboard.writeText(secondTextArea.value);
                });

                // Add audio icon
                const audioIcon = document.createElement('img');
                audioIcon.src = 'audio.png';
                audioIcon.alt = 'audio';
                audioIcon.className = 'audio-icon';
                secondTextArea.parentElement.appendChild(audioIcon);

                audioIcon.addEventListener('click', () => {
                    const translatedText = secondTextArea.value;
                    const audio = new SpeechSynthesisUtterance(translatedText);
                    window.speechSynthesis.speak(audio);
                });
            })
            .catch((errors) => {
                error.innerHTML = errors;
                setTimeout(() => { error.innerHTML = ""; }, 5000);
            });
    });
});
