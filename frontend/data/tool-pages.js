/** Content for every tool/platform article page rendered by pages/[slug].js
 * (long-form copy lives in tool-articles.js; the tool itself is on the homepage).
 * Keep claims in step with what the backend really does (formats, limits,
 * caption availability) — these pages are read by people deciding whether
 * the tool fits, so an over-promise here is a broken experience later. */

const FAQ_FREE = {
  q: 'Is it free? Do I need an account?',
  a: 'Yes, it is free, and there is no account, email or app to install. Paste a link and the tool works in your browser on any device.',
};
const FAQ_STORAGE = {
  q: 'Do you keep a copy of my files?',
  a: 'No. Files are held on our server only while they are being prepared and are deleted automatically about twenty minutes later. We do not keep a record of what you download.',
};
const FAQ_LEGAL = {
  q: 'Is it legal to use?',
  a: 'Saving content you created, own, or have permission to use is generally fine. Downloading copyrighted material without permission may breach the platform’s terms or local copyright law. You are responsible for how you use the files.',
};

export const TOOL_PAGES = [
  /* ------------------------------------------------------------ feature tools */
  {
    slug: 'video-downloader',
    group: 'tool',
    navLabel: 'Video Downloader',
    title: 'Online Video Downloader – MP4 up to 4K',
    description:
      'Download online videos as MP4 in 360p, 720p, 1080p, 1440p or 4K. Free, no signup, works with YouTube, TikTok, Instagram, Facebook and 900+ sites.',
    h1: 'Online Video Downloader',
    lead: 'Paste a video link, pick the resolution you want, and save a clean MP4 that plays everywhere — from 360p up to 4K.',
    steps: [
      { title: 'Copy the video link', text: 'Open the video in your browser or app and copy its URL from the address bar or the Share menu.' },
      { title: 'Paste it on the homepage', text: 'Drop the link into the box on the Clip Converter homepage and press Get Clip. We read the available qualities in a few seconds.' },
      { title: 'Choose a quality', text: 'Pick a resolution from the list and press Download. The file is saved straight to your device.' },
    ],
    features: [
      { icon: 'quality', title: 'From 360p to 4K', text: 'Every resolution the source offers is listed, with its real dimensions and an estimated file size.' },
      { icon: 'play', title: 'MP4 that plays anywhere', text: 'We prefer H.264 video with AAC audio, so files open on phones, TVs and editors without extra codecs.' },
      { icon: 'bolt', title: 'Live progress', text: 'The button fills as the file is prepared, so you always know whether it is downloading, merging or done.' },
      { icon: 'shield', title: 'Private by default', text: 'No account, no tracking of what you save, and files are wiped from our server after twenty minutes.' },
    ],
    specs: {
      heading: 'Formats and quality',
      rows: [
        ['Output format', 'MP4 (H.264 video + AAC audio when available)'],
        ['Resolutions', '360p, 480p, 720p, 1080p, 1440p, 2160p (4K) — whatever the source provides'],
        ['Audio', 'Included and merged automatically'],
        ['Limits', 'No fixed size limit; very long 4K videos may hit a processing time limit'],
      ],
    },
    faqs: [
      { q: 'Why is 1080p or 4K slower than 720p?', a: 'Above 720p most platforms serve video and audio as separate streams. We download both and merge them into one MP4, which takes real processing time. Lower resolutions skip most of that work.' },
      { q: 'Why is the file size only an estimate?', a: 'Platforms usually report an average bitrate rather than an exact size. Videos with little motion compress far better than the average, so the final file is often smaller than shown.' },
      { q: 'Why does a link fail?', a: 'The most common reason is that the video is private, age-restricted, region-blocked or needs a login. Public videos work in the vast majority of cases.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['mp3-converter', 'video-trimmer', 'playlist-downloader', 'youtube-downloader'],
  },
  {
    slug: 'mp3-converter',
    group: 'tool',
    navLabel: 'MP3 Converter',
    title: 'Video to MP3 Converter – MP3, M4A, WAV, FLAC',
    description:
      'Convert any online video to audio. Extract MP3, M4A, WAV or FLAC at the best available quality — free, fast and without signup.',
    h1: 'Video to MP3 Converter',
    lead: 'Turn any video link into an audio file. Choose MP3 for compatibility, M4A for small size, or WAV and FLAC for editing.',
    steps: [
      { title: 'Copy the link', text: 'Copy the URL of the video, song, podcast or lecture you want as audio.' },
      { title: 'Paste and press Get Clip', text: 'Paste the link on the Clip Converter homepage, press Get Clip, then open the Audio tab to see every format we can produce.' },
      { title: 'Pick a format', text: 'Press Download next to MP3, M4A, WAV or FLAC. The audio is extracted and saved to your device.' },
    ],
    features: [
      { icon: 'music', title: 'Four audio formats', text: 'MP3 and M4A for everyday listening, WAV and FLAC when you need an uncompressed or lossless file.' },
      { icon: 'quality', title: 'Best source quality', text: 'We always take the highest-quality audio stream the platform offers before converting.' },
      { icon: 'scissors', title: 'Trim before you save', text: 'Only need the chorus or one answer from a long interview? Set a start and end time first.' },
      { icon: 'device', title: 'Works on any device', text: 'Runs in the browser on Windows, Mac, Android and iPhone. Nothing to install.' },
    ],
    specs: {
      heading: 'Which audio format should I choose?',
      rows: [
        ['MP3', 'Plays on everything. The safe default for music players, cars and phones.'],
        ['M4A (AAC)', 'Smaller files at similar quality. Ideal for Apple devices.'],
        ['WAV', 'Uncompressed. Best for editing in a DAW or video editor; large files.'],
        ['FLAC', 'Lossless compression. Archive quality at roughly half the size of WAV.'],
      ],
    },
    faqs: [
      { q: 'Does converting to WAV or FLAC improve the sound?', a: 'No. The source audio on most platforms is already compressed, so WAV and FLAC cannot add detail that is not there. They are useful because they avoid a second round of lossy compression when you edit.' },
      { q: 'Can I convert a whole playlist to MP3?', a: 'Yes. Paste the playlist link, choose Audio (MP3), select the tracks you want and download them together. See the Playlist Downloader for details.' },
      { q: 'Can I save just part of the audio?', a: 'Yes. Press Trim, set the start and end time, and only that section is converted.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['youtube-to-mp3', 'video-trimmer', 'playlist-downloader', 'video-downloader'],
  },
  {
    slug: 'transcript',
    group: 'tool',
    navLabel: 'Transcript Generator',
    title: 'Free YouTube Transcript Generator',
    description:
      'Get the full transcript of a YouTube video in seconds. Read it with timestamps, copy it, or download it as a TXT file — in every caption language the video offers.',
    h1: 'YouTube Transcript Generator',
    lead: 'Turn a video into clean, readable text. Read the transcript on the page with timestamps, copy it in one click, or download it as a TXT file.',
    steps: [
      { title: 'Paste the video link', text: 'Copy the YouTube URL and paste it into the box on the Clip Converter homepage, then press Get Clip.' },
      { title: 'Choose a language', text: 'Open the Transcript tab and pick any caption language from the menu, including auto-generated and auto-translated ones.' },
      { title: 'Read, copy or download', text: 'Read the transcript on the page, press Copy for the full text, or press Download .txt to save it.' },
    ],
    features: [
      { icon: 'lang', title: 'Every available language', text: 'Creator-written captions, auto-generated captions and YouTube’s auto-translations are all listed — not just the first few.' },
      { icon: 'file', title: 'Clean, readable text', text: 'The repeated lines found in auto-captions are de-duplicated, and the copied or downloaded text has no timestamps, so it reads naturally.' },
      { icon: 'clock', title: 'Timestamps on the page', text: 'Every passage is shown next to its time in the video, so you can jump straight to the moment you need.' },
      { icon: 'bolt', title: 'Ready in seconds', text: 'Transcripts come from the video’s caption track, so even a two-hour lecture is ready almost instantly.' },
    ],
    specs: {
      heading: 'What you can do with a transcript',
      rows: [
        ['Study and research', 'Search a lecture for a term, quote a speaker accurately, or build notes from a talk.'],
        ['Content creation', 'Turn a video into a blog post, newsletter, show notes or social captions.'],
        ['Accessibility', 'Read along, or follow content without sound.'],
        ['Translation', 'Use an auto-translated track as a starting point for a translation.'],
      ],
    },
    faqs: [
      { q: 'Why does a video show no transcript?', a: 'The tool reads the caption track that the platform provides. If the creator disabled captions and YouTube has not generated automatic ones — common for music, very new uploads or videos without speech — there is nothing to read.' },
      { q: 'Does it work for Instagram, Facebook or TikTok?', a: 'Usually not. Those platforms rarely expose a caption track, so no transcript is available for most of their videos. YouTube is where this tool works reliably.' },
      { q: 'How accurate is the transcript?', a: 'Creator-provided captions are normally very accurate. Auto-generated captions depend on audio quality, accents and background music, so expect occasional mistakes in names and technical terms.' },
      { q: 'Can I get the transcript with timings as a file?', a: 'The TXT download is plain text, which is best for reading and editing. For a timed file that video players and editors understand, use the Subtitles tab to download the same captions as VTT.' },
      FAQ_FREE,
    ],
    related: ['subtitle-downloader', 'chapters-extractor', 'tags-extractor', 'youtube-downloader'],
  },
  {
    slug: 'subtitle-downloader',
    group: 'tool',
    navLabel: 'Subtitle Downloader',
    title: 'YouTube Subtitle Downloader – All Languages',
    description:
      'Download subtitles and closed captions from YouTube videos as VTT files. Every language is listed, including auto-generated and auto-translated captions.',
    h1: 'YouTube Subtitle Downloader',
    lead: 'Save the captions of a video as a subtitle file. Every language the video offers is listed, clearly marked as creator-written or auto-generated.',
    steps: [
      { title: 'Paste the video link', text: 'Copy the video URL, paste it on the Clip Converter homepage and press Get Clip.' },
      { title: 'Choose a language', text: 'Open the Subtitles tab and pick a language from the menu — automatic tracks are marked “auto”.' },
      { title: 'Preview and download', text: 'Check the preview, then press Download subtitle to save the file, ready for your player or editor.' },
    ],
    features: [
      { icon: 'lang', title: 'Complete language list', text: 'We list every caption track the video has, rather than a shortened selection.' },
      { icon: 'file', title: 'Standard VTT format', text: 'WebVTT files open in VLC, most video editors and every HTML5 player, and convert easily to SRT.' },
      { icon: 'copy', title: 'Need plain text instead?', text: 'Switch to the Transcript tab to read the same captions as clean text, copy them or save a TXT file.' },
      { icon: 'shield', title: 'Creator captions first', text: 'When a language has both creator-written and automatic captions, you get the more accurate creator version.' },
    ],
    specs: {
      heading: 'Subtitle details',
      rows: [
        ['File format', 'WebVTT (.vtt) with full timing information'],
        ['Languages', 'All manual, auto-generated and auto-translated tracks available for the video'],
        ['Need plain text?', 'Use the Transcript tab for clean text without timestamps'],
        ['Need SRT?', 'VTT converts to SRT in any free subtitle editor in seconds'],
      ],
    },
    faqs: [
      { q: 'Why are no subtitles listed for my video?', a: 'The video has no caption track. This happens when the creator turned captions off and the platform has not generated automatic ones.' },
      { q: 'What does “Auto-generated” mean?', a: 'The captions were created by speech recognition rather than written by the creator. They are usually good for clear speech and weaker for music, noise or strong accents.' },
      { q: 'How do I use the file with a downloaded video?', a: 'Put the subtitle file in the same folder as the video with the same file name. Players such as VLC load it automatically.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['transcript', 'video-downloader', 'chapters-extractor', 'youtube-downloader'],
  },
  {
    slug: 'thumbnail-downloader',
    group: 'tool',
    navLabel: 'Thumbnail Downloader',
    title: 'YouTube Thumbnail Downloader – HD Quality',
    description:
      'Download the thumbnail of any YouTube video in HD. Preview every available size and save the full-resolution image in one click — free, no signup.',
    h1: 'Video Thumbnail Downloader',
    lead: 'Grab the cover image of any video in the highest resolution the platform provides. Preview each size before you save.',
    steps: [
      { title: 'Paste the video link', text: 'Copy the video URL, paste it on the Clip Converter homepage and press Get Clip.' },
      { title: 'Preview the sizes', text: 'The Thumbnail tab shows each available resolution with a small preview.' },
      { title: 'Save the image', text: 'Press Download next to the size you want. The image is saved with the video’s title as its file name.' },
    ],
    features: [
      { icon: 'image', title: 'Highest resolution available', text: 'Up to full HD where the platform provides it, plus smaller sizes for quick use.' },
      { icon: 'play', title: 'Preview before saving', text: 'See every size side by side so you do not download the wrong one.' },
      { icon: 'list', title: 'Save several sizes together', text: 'Select more than one resolution and download them in a single step.' },
      { icon: 'device', title: 'Works beyond YouTube', text: 'Cover images are available for most supported platforms, not only YouTube.' },
    ],
    specs: {
      heading: 'Common uses',
      rows: [
        ['Design reference', 'Study what works in your niche before designing your own thumbnail.'],
        ['Presentations and articles', 'Illustrate a video you are reviewing or citing.'],
        ['Your own videos', 'Recover a thumbnail when the original file is lost.'],
        ['Playlists and catalogues', 'Build a visual index of a channel or course.'],
      ],
    },
    faqs: [
      { q: 'What is the largest size I can get?', a: 'It depends on what was uploaded. Most YouTube videos offer 1280×720; some older or low-resolution uploads only have smaller versions.' },
      { q: 'Can I use a downloaded thumbnail in my own work?', a: 'Thumbnails are copyrighted by their creators. Using them for reference or commentary is normally fine; re-using one as your own thumbnail is not.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['tags-extractor', 'metadata-extractor', 'video-downloader', 'youtube-downloader'],
  },
  {
    slug: 'video-trimmer',
    group: 'tool',
    navLabel: 'Video Trimmer',
    title: 'Online Video Trimmer – Download Only a Clip',
    description:
      'Cut a section out of any online video and download just that part. Set a start and end time, then save the clip as MP4 or MP3 — free and in your browser.',
    h1: 'Online Video Trimmer',
    lead: 'Need thirty seconds from a two-hour video? Set a start and end time and download only that section — as video or as audio.',
    steps: [
      { title: 'Paste the video link', text: 'Paste the URL on the Clip Converter homepage and press Get Clip to load the video.' },
      { title: 'Press Trim and set the range', text: 'Drag the two handles on the timeline or type exact start and end times, then press Apply Trim.' },
      { title: 'Download the clip', text: 'Choose a quality or an audio format. Only the selected section is prepared and saved.' },
    ],
    features: [
      { icon: 'scissors', title: 'Timeline and exact times', text: 'Drag the range on a visual timeline or type times such as 1:30 and 2:45 for precision.' },
      { icon: 'bolt', title: 'Much faster than a full download', text: 'Only the section you choose is fetched, so clipping a long video takes a fraction of the time.' },
      { icon: 'music', title: 'Video or audio', text: 'Save the clip as MP4 in any listed quality, or as MP3, M4A, WAV or FLAC.' },
      { icon: 'quality', title: 'No re-compression for video', text: 'Video clips are cut without re-encoding, so the quality is identical to the original.' },
    ],
    specs: {
      heading: 'How precise is the cut?',
      rows: [
        ['Video clips', 'Cut at the nearest keyframe — accurate to about one second, with no quality loss'],
        ['Audio clips', 'Cut exactly at the times you enter'],
        ['Time format', 'mm:ss or h:mm:ss'],
        ['File name', 'Saved with “-trim” added so it is easy to tell from the full video'],
      ],
    },
    faqs: [
      { q: 'Why does my clip start a moment early?', a: 'To keep the original quality, video is cut at the closest keyframe rather than re-encoded. That can place the start up to about a second before the time you chose.' },
      { q: 'Can I trim a playlist or several links at once?', a: 'Trimming applies to a single video. Playlists and bulk downloads always save the full file.' },
      { q: 'Is there a limit on clip length?', a: 'No. The clip can be anything from a few seconds to almost the whole video.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['video-downloader', 'mp3-converter', 'youtube-shorts-downloader', 'chapters-extractor'],
  },
  {
    slug: 'playlist-downloader',
    group: 'tool',
    navLabel: 'Playlist Downloader',
    title: 'YouTube Playlist Downloader – MP4 or MP3',
    description:
      'Download a whole YouTube playlist or channel. Paste one link, select the videos you want and save them as MP4 or MP3 — up to 100 videos per playlist.',
    h1: 'YouTube Playlist Downloader',
    lead: 'Paste a playlist or channel link once. Select the videos you want and save them together as MP4 video or MP3 audio.',
    steps: [
      { title: 'Paste the playlist link', text: 'Copy the playlist or channel URL, paste it on the Clip Converter homepage and press Get Clip.' },
      { title: 'Choose MP4 or MP3', text: 'Pick Video (MP4) or Audio (MP3) once — it applies to every item in the list.' },
      { title: 'Select and download', text: 'Tick the videos you want, or download them one by one. Each file shows its own progress.' },
    ],
    features: [
      { icon: 'list', title: 'Up to 100 videos per link', text: 'Every video is listed with its title, thumbnail and duration so you can choose exactly what to keep.' },
      { icon: 'music', title: 'Video or audio', text: 'Save a course as MP4, or turn a music playlist into MP3 files in one pass.' },
      { icon: 'bolt', title: 'Queued automatically', text: 'Selected videos are queued and processed in order. You can see each item’s position and progress.' },
      { icon: 'play', title: 'Channels too', text: 'A channel’s Videos, Shorts or Streams page works the same way as a playlist.' },
    ],
    specs: {
      heading: 'Playlist details',
      rows: [
        ['Videos per playlist', 'The first 100 items are listed'],
        ['Formats', 'MP4 at the best available quality, or MP3'],
        ['File names', 'Each file is named after its own video title'],
        ['Private playlists', 'Not supported — the playlist must be public or unlisted'],
      ],
    },
    faqs: [
      { q: 'Can I choose the resolution for each video?', a: 'Playlist downloads use the best available quality so the list loads quickly. For a specific resolution, paste that single video’s link instead.' },
      { q: 'My playlist has more than 100 videos. What now?', a: 'The first 100 are listed. For the rest, split the playlist or paste individual links with the Bulk Downloader.' },
      { q: 'Do the files arrive as a ZIP?', a: 'No. Each video is saved as its own file, so you can start using the first ones while the others are still processing.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['bulk-downloader', 'mp3-converter', 'youtube-downloader', 'youtube-to-mp3'],
  },
  {
    slug: 'bulk-downloader',
    group: 'tool',
    navLabel: 'Bulk Downloader',
    title: 'Bulk Video Downloader – Multiple Links at Once',
    description:
      'Download many videos in one go. Paste up to 25 links from YouTube, TikTok, Instagram, Facebook and more, then save them all as MP4 or MP3.',
    h1: 'Bulk Video Downloader',
    lead: 'Stop pasting links one at a time. Add up to 25 URLs — from different platforms if you like — and download them together.',
    steps: [
      { title: 'Paste your links', text: 'On the homepage, choose “Paste multiple links” and put one URL per line. Links from different sites can be mixed freely.' },
      { title: 'Press Get Links', text: 'Each link is checked and listed with its title and thumbnail. Links that cannot be read are skipped.' },
      { title: 'Select and download', text: 'Choose MP4 or MP3, tick the videos you want and press Download Selected.' },
    ],
    features: [
      { icon: 'list', title: 'Up to 25 links per batch', text: 'Enough for a research session, a client’s content library or a week of saved posts.' },
      { icon: 'device', title: 'Mix platforms', text: 'YouTube, TikTok, Instagram, Facebook and other supported sites can sit in the same batch.' },
      { icon: 'quality', title: 'Several qualities of one video', text: 'On a single video, tick several resolutions or formats and download them all in one step.' },
      { icon: 'bolt', title: 'Clear progress for every file', text: 'Each item shows whether it is queued, downloading, merging or finished.' },
    ],
    specs: {
      heading: 'Bulk download details',
      rows: [
        ['Links per batch', 'Up to 25, one per line'],
        ['Formats', 'MP4 at the best available quality, or MP3'],
        ['Processing', 'Files are queued and prepared in order to keep the service fast for everyone'],
        ['One video, many formats', 'Use the checkboxes in the quality list of any single video'],
      ],
    },
    faqs: [
      { q: 'What happens if one of my links is broken?', a: 'It is skipped, and the rest of the batch loads normally. Private or removed videos are the usual cause.' },
      { q: 'Why are my files downloading one after another?', a: 'The server prepares a limited number of files at a time so that every visitor gets a reliable speed. Your remaining items wait in a queue and start automatically.' },
      { q: 'Is a playlist link better than pasting every video?', a: 'Yes. For a playlist or channel, paste the single playlist link — you get up to 100 videos without collecting the URLs yourself.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['playlist-downloader', 'video-downloader', 'mp3-converter', 'tiktok-downloader'],
  },
  {
    slug: 'tags-extractor',
    group: 'tool',
    navLabel: 'Tags Extractor',
    title: 'YouTube Tag Extractor – See Any Video’s Tags',
    description:
      'Reveal the hidden tags of any YouTube video and copy them in one click. A free tag extractor for keyword research, SEO and competitor analysis.',
    h1: 'YouTube Tag Extractor',
    lead: 'YouTube hides video tags from viewers. Paste a link to reveal them and copy the full list in one click.',
    steps: [
      { title: 'Paste the video link', text: 'Copy the URL of the video you want to analyse and paste it on the Clip Converter homepage.' },
      { title: 'Press Get Clip', text: 'The video’s title, description and tags are loaded in a few seconds.' },
      { title: 'Copy the tags', text: 'Press Copy tags to put the full comma-separated list on your clipboard.' },
    ],
    features: [
      { icon: 'copy', title: 'One-click copy', text: 'Tags are copied as a clean, comma-separated list — ready to paste into YouTube Studio or a spreadsheet.' },
      { icon: 'file', title: 'Title and description too', text: 'Copy the title and the full description alongside the tags to see the whole keyword strategy.' },
      { icon: 'list', title: 'Export everything', text: 'Save the title, tags, description, views and upload date together as JSON or CSV.' },
      { icon: 'bolt', title: 'No extension needed', text: 'Works in any browser, on desktop and mobile, without installing anything.' },
    ],
    specs: {
      heading: 'How to use tags well',
      rows: [
        ['Find patterns', 'Compare several top videos for one topic and note the tags they share.'],
        ['Stay relevant', 'Only use tags that genuinely describe your video; misleading tags break YouTube’s rules.'],
        ['Think beyond tags', 'Title, thumbnail and watch time matter far more to ranking than tags do.'],
        ['Keep a record', 'Export to CSV to build a keyword list over time.'],
      ],
    },
    faqs: [
      { q: 'Why does a video show no tags?', a: 'The creator did not add any. Tags are optional, and many large channels leave them empty.' },
      { q: 'Do tags still matter for YouTube SEO?', a: 'They play a small role. YouTube itself says tags are most useful for commonly misspelled words. They are still a good window into which keywords a creator is targeting.' },
      { q: 'Does it work for other platforms?', a: 'Tags are shown whenever the platform provides them. YouTube is the platform where this is most consistent.' },
      FAQ_FREE,
    ],
    related: ['metadata-extractor', 'thumbnail-downloader', 'transcript', 'chapters-extractor'],
  },
  {
    slug: 'metadata-extractor',
    group: 'tool',
    navLabel: 'Metadata Extractor',
    title: 'Video Metadata Extractor – Export JSON or CSV',
    description:
      'Extract a video’s title, description, tags, views, upload date, duration and chapters, and export everything as JSON or CSV. Free and instant.',
    h1: 'Video Metadata Extractor',
    lead: 'Pull the full details of a video — title, description, tags, views, upload date and more — and export them as JSON or CSV.',
    steps: [
      { title: 'Paste the video link', text: 'Paste the URL on the Clip Converter homepage and press Get Clip.' },
      { title: 'Review the details', text: 'Title, channel, duration, resolution, description and tags appear at the top of the result.' },
      { title: 'Export', text: 'Open the Export menu and choose JSON or CSV. The file downloads immediately.' },
    ],
    features: [
      { icon: 'file', title: 'JSON and CSV', text: 'JSON for scripts and developers; CSV for Excel, Google Sheets and reporting.' },
      { icon: 'list', title: 'Everything in one file', text: 'Title, description, tags, uploader, source, duration, resolution, view count and upload date.' },
      { icon: 'copy', title: 'Copy single fields', text: 'Need only the title or the description? Copy either one with a single click.' },
      { icon: 'clock', title: 'Chapters included', text: 'The JSON export also contains the video’s chapter list with start times.' },
    ],
    specs: {
      heading: 'Fields in the export',
      rows: [
        ['Basics', 'Title, uploader / channel, source platform'],
        ['Content', 'Full description and tags'],
        ['Numbers', 'Duration in seconds, native resolution, view count, upload date'],
        ['Structure', 'Chapters with titles and start times (JSON only)'],
      ],
    },
    faqs: [
      { q: 'Who is this for?', a: 'Researchers cataloguing sources, marketers auditing competitors, archivists, and developers who need clean video data without setting up an API key.' },
      { q: 'Why is a field empty?', a: 'Not every platform publishes every field. View counts, tags and upload dates are common on YouTube and less consistent elsewhere.' },
      { q: 'Can I export many videos at once?', a: 'Exports are per video. For a large list, export each video and combine the CSV files in a spreadsheet.' },
      FAQ_FREE,
    ],
    related: ['tags-extractor', 'chapters-extractor', 'transcript', 'thumbnail-downloader'],
  },
  {
    slug: 'chapters-extractor',
    group: 'tool',
    navLabel: 'Chapters Extractor',
    title: 'YouTube Chapters & Timestamps Extractor',
    description:
      'Extract the chapters and timestamps of any YouTube video. View the full list and copy it in one click — perfect for notes, show notes and descriptions.',
    h1: 'YouTube Chapters Extractor',
    lead: 'See every chapter of a video with its timestamp, and copy the whole list in one click.',
    steps: [
      { title: 'Paste the video link', text: 'Paste the URL on the Clip Converter homepage and press Get Clip.' },
      { title: 'Open Chapters', text: 'If the video has chapters, a Chapters section appears under the video details.' },
      { title: 'Copy the list', text: 'Press Copy chapters to get every timestamp and title as text, one per line.' },
    ],
    features: [
      { icon: 'clock', title: 'Timestamps and titles', text: 'Each chapter is listed with its start time in the familiar 0:00 format.' },
      { icon: 'copy', title: 'Ready to paste', text: 'The copied list uses the exact “0:00 Title” layout YouTube expects in a description.' },
      { icon: 'scissors', title: 'Pairs with the trimmer', text: 'Use a chapter’s start and end times to download just that chapter as a clip.' },
      { icon: 'file', title: 'Included in JSON export', text: 'Need structured data? The JSON export contains all chapters with their start times in seconds.' },
    ],
    specs: {
      heading: 'What chapters are useful for',
      rows: [
        ['Notes and study', 'Outline a lecture or tutorial in seconds.'],
        ['Show notes', 'Reuse the list for a podcast page or newsletter.'],
        ['Clipping', 'Find the exact section worth cutting and sharing.'],
        ['Your own uploads', 'Recover the chapter list from a published video.'],
      ],
    },
    faqs: [
      { q: 'Why is there no Chapters section for my video?', a: 'The video has no chapters. They only exist when the creator adds timestamps to the description or when YouTube generates them automatically.' },
      { q: 'Can I download a single chapter?', a: 'Yes. Note the chapter’s start time and the next chapter’s start time, press Trim, enter both, and download the clip.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['video-trimmer', 'transcript', 'metadata-extractor', 'tags-extractor'],
  },

  /* ---------------------------------------------------------- platform pages */
  {
    slug: 'youtube-downloader',
    group: 'platform',
    navLabel: 'YouTube Downloader',
    title: 'YouTube Video Downloader – 1080p & 4K MP4',
    description:
      'Download YouTube videos as MP4 in 720p, 1080p, 1440p or 4K. Also save audio, subtitles, transcripts and thumbnails. Free, no signup, no software.',
    h1: 'YouTube Video Downloader',
    lead: 'Save YouTube videos in the quality you actually want — from 360p to 4K — plus audio, subtitles, transcripts and thumbnails from the same link.',
    steps: [
      { title: 'Copy the YouTube link', text: 'Use the address bar, or Share → Copy link in the YouTube app. youtu.be short links work too.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip and the available qualities load in a few seconds.' },
      { title: 'Download', text: 'Choose a resolution and press Download. The MP4 is saved to your device.' },
    ],
    features: [
      { icon: 'quality', title: 'Up to 4K', text: '360p, 480p, 720p, 1080p, 1440p and 2160p are offered whenever the upload has them.' },
      { icon: 'list', title: 'Playlists and channels', text: 'Paste a playlist or channel link to list up to 100 videos and download them together.' },
      { icon: 'lang', title: 'Subtitles and transcripts', text: 'Every caption language is available as a VTT file or as clean, readable text.' },
      { icon: 'scissors', title: 'Download only a clip', text: 'Set a start and end time to save one part of a long video.' },
    ],
    specs: {
      heading: 'Everything you can save from one YouTube link',
      rows: [
        ['Video', 'MP4, 360p to 4K, with audio merged in'],
        ['Audio', 'MP3, M4A, WAV or FLAC'],
        ['Text', 'Subtitles (VTT), transcript (TXT), chapters, tags, description'],
        ['Images and data', 'Thumbnail in every size, metadata as JSON or CSV'],
      ],
    },
    faqs: [
      { q: 'Does it work with Shorts, live streams and music?', a: 'Shorts and regular videos work. Finished live streams work once YouTube has processed them. Streams that are still live cannot be saved.' },
      { q: 'Why does 1080p take longer than 720p?', a: 'YouTube serves higher resolutions as separate video and audio streams. We merge them into a single MP4 for you, which takes extra time.' },
      { q: 'Why do some videos fail?', a: 'Private, members-only, age-restricted and region-blocked videos need a signed-in account, so they cannot be fetched.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['youtube-to-mp3', 'youtube-shorts-downloader', 'playlist-downloader', 'transcript'],
  },
  {
    slug: 'youtube-to-mp3',
    group: 'platform',
    navLabel: 'YouTube to MP3',
    title: 'YouTube to MP3 Converter – Fast & Free',
    description:
      'Convert YouTube videos to MP3 in seconds. Best available audio quality, optional trimming, and M4A, WAV or FLAC when you need them. No signup.',
    h1: 'YouTube to MP3 Converter',
    lead: 'Paste a YouTube link and save the audio as MP3 — or as M4A, WAV or FLAC. Trim it first if you only need one part.',
    steps: [
      { title: 'Copy the YouTube link', text: 'Copy the URL of the song, podcast, lecture or interview.' },
      { title: 'Paste and press Get Clip', text: 'Paste the link on the Clip Converter homepage, press Get Clip, then open the Audio tab.' },
      { title: 'Download the MP3', text: 'Press Download next to MP3, or choose another format from the list.' },
    ],
    features: [
      { icon: 'music', title: 'Best available audio', text: 'We always start from YouTube’s highest-quality audio stream before converting.' },
      { icon: 'scissors', title: 'Trim to the part you need', text: 'Cut a single song out of a mix, or one answer out of a long interview.' },
      { icon: 'list', title: 'Whole playlists to MP3', text: 'Paste a playlist link, choose Audio (MP3) and download the tracks together.' },
      { icon: 'device', title: 'Works on phones', text: 'Runs in Safari and Chrome on iPhone and Android — no app required.' },
    ],
    specs: {
      heading: 'Audio formats',
      rows: [
        ['MP3', 'Universal compatibility — the default choice'],
        ['M4A', 'Smaller files, ideal for Apple devices'],
        ['WAV', 'Uncompressed, for editing'],
        ['FLAC', 'Lossless, for archiving'],
      ],
    },
    faqs: [
      { q: 'What bitrate is the MP3?', a: 'The file is encoded at the encoder’s highest variable-bitrate setting from YouTube’s best audio stream. Quality is limited by the source, so a higher number would not add real detail.' },
      { q: 'How long can the video be?', a: 'There is no fixed length limit. Very long videos take longer to convert and may reach a processing time limit.' },
      { q: 'Can I convert a playlist?', a: 'Yes — paste the playlist link and select Audio (MP3). Up to 100 tracks are listed.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['mp3-converter', 'playlist-downloader', 'video-trimmer', 'youtube-downloader'],
  },
  {
    slug: 'youtube-shorts-downloader',
    group: 'platform',
    navLabel: 'YouTube Shorts Downloader',
    title: 'YouTube Shorts Downloader – HD MP4',
    description:
      'Download YouTube Shorts as MP4 in full HD, or save just the audio as MP3. Paste the Shorts link and download in seconds — free and without an app.',
    h1: 'YouTube Shorts Downloader',
    lead: 'Save any YouTube Short in its original vertical HD quality, or keep only the sound as MP3.',
    steps: [
      { title: 'Copy the Shorts link', text: 'In the YouTube app press Share → Copy link, or copy the youtube.com/shorts/… URL from your browser.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the available qualities.' },
      { title: 'Download', text: 'Choose a resolution for MP4, or open the Audio tab for MP3.' },
    ],
    features: [
      { icon: 'quality', title: 'Original vertical quality', text: 'Shorts are saved in their native 9:16 format at the best resolution available.' },
      { icon: 'music', title: 'Sound only', text: 'Save the audio of a Short as MP3 when it is the sound you are after.' },
      { icon: 'list', title: 'A channel’s Shorts together', text: 'Paste a channel’s Shorts page to list its videos and download several at once.' },
      { icon: 'device', title: 'Made for mobile', text: 'The whole flow works comfortably on a phone screen.' },
    ],
    specs: {
      heading: 'Shorts details',
      rows: [
        ['Format', 'MP4, vertical (9:16)'],
        ['Quality', 'Up to the resolution the Short was uploaded in, typically 1080×1920'],
        ['Audio', 'MP3, M4A, WAV or FLAC'],
        ['Bulk', 'Channel Shorts pages and multiple links are supported'],
      ],
    },
    faqs: [
      { q: 'Will the downloaded Short have a watermark?', a: 'No. YouTube does not burn a watermark into Shorts, and we do not add one.' },
      { q: 'Can I repost a downloaded Short?', a: 'Only if it is your own video or you have the creator’s permission. Re-uploading other people’s content breaks platform rules and copyright law.' },
      FAQ_FREE,
      FAQ_STORAGE,
    ],
    related: ['youtube-downloader', 'tiktok-downloader', 'instagram-downloader', 'bulk-downloader'],
  },
  {
    slug: 'tiktok-downloader',
    group: 'platform',
    navLabel: 'TikTok Downloader',
    title: 'TikTok Video Downloader – MP4 & MP3',
    description:
      'Download TikTok videos as MP4 or save the sound as MP3. Paste the TikTok link and download in seconds — free, no app and no account needed.',
    h1: 'TikTok Video Downloader',
    lead: 'Save TikTok videos to your phone or computer as MP4, or keep just the sound as MP3.',
    steps: [
      { title: 'Copy the TikTok link', text: 'Open the video, press Share and choose Copy link. Short vm.tiktok.com links work too.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the video.' },
      { title: 'Download', text: 'Save the MP4, or switch to the Audio tab for the sound.' },
    ],
    features: [
      { icon: 'play', title: 'MP4 that plays anywhere', text: 'Files open on any phone, computer or editing app.' },
      { icon: 'music', title: 'Save the sound', text: 'Extract a TikTok sound as MP3, M4A, WAV or FLAC.' },
      { icon: 'list', title: 'Many videos at once', text: 'Paste up to 25 TikTok links and download them as a batch.' },
      { icon: 'device', title: 'No app, no login', text: 'Works in your mobile browser. We never ask for your TikTok account.' },
    ],
    specs: {
      heading: 'TikTok details',
      rows: [
        ['Format', 'MP4 video or MP3 / M4A / WAV / FLAC audio'],
        ['Quality', 'The best quality TikTok provides for that video'],
        ['Links', 'Full tiktok.com links and short vm.tiktok.com links'],
        ['Not supported', 'Private accounts and videos removed by TikTok'],
      ],
    },
    faqs: [
      { q: 'Why can’t a TikTok video be downloaded?', a: 'The account is private, the video was deleted, or TikTok is limiting access from our region. Public videos normally work.' },
      { q: 'Are captions or transcripts available for TikTok?', a: 'Only occasionally. TikTok exposes captions for some videos, but not reliably, so the Subtitles and Transcript tabs often do not appear.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['instagram-downloader', 'youtube-shorts-downloader', 'bulk-downloader', 'mp3-converter'],
  },
  {
    slug: 'instagram-downloader',
    group: 'platform',
    navLabel: 'Instagram Downloader',
    title: 'Instagram Reels & Video Downloader',
    description:
      'Download Instagram Reels and videos as MP4, or save the audio as MP3. Paste the link of any public post — free, no login and no app.',
    h1: 'Instagram Reels & Video Downloader',
    lead: 'Save public Instagram Reels and video posts as MP4, or extract the audio — without logging in.',
    steps: [
      { title: 'Copy the Instagram link', text: 'Press the share icon or the ⋯ menu on the Reel or post and choose Copy link.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the video.' },
      { title: 'Download', text: 'Save the MP4, or open the Audio tab to keep only the sound.' },
    ],
    features: [
      { icon: 'play', title: 'Reels and video posts', text: 'Public Reels and video posts are saved as standard MP4 files.' },
      { icon: 'music', title: 'Audio from Reels', text: 'Keep the sound of a Reel as MP3, M4A, WAV or FLAC.' },
      { icon: 'shield', title: 'We never ask for your login', text: 'You do not enter your Instagram username or password anywhere on this site.' },
      { icon: 'list', title: 'Several links together', text: 'Paste up to 25 links and download them as one batch.' },
    ],
    specs: {
      heading: 'Instagram details',
      rows: [
        ['Works with', 'Public Reels and public video posts'],
        ['Does not work with', 'Private accounts, Stories and posts that need a login to view'],
        ['Format', 'MP4 video or MP3 / M4A / WAV / FLAC audio'],
        ['Captions', 'Instagram does not provide caption tracks, so no transcript is available'],
      ],
    },
    faqs: [
      { q: 'Why do Instagram links fail more often than YouTube links?', a: 'Instagram restricts a lot of content to signed-in users and limits automated access. If a post opens only when you are logged in, it cannot be fetched here.' },
      { q: 'Can I download from a private account I follow?', a: 'No. The tool can only see what is visible to everyone on the public web.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['tiktok-downloader', 'facebook-downloader', 'bulk-downloader', 'mp3-converter'],
  },
  {
    slug: 'facebook-downloader',
    group: 'platform',
    navLabel: 'Facebook Downloader',
    title: 'Facebook Video Downloader – HD MP4',
    description:
      'Download public Facebook videos and Reels as MP4 in HD, or save the audio as MP3. Paste the link and download — free, no login and no software.',
    h1: 'Facebook Video Downloader',
    lead: 'Save public Facebook videos, Reels and Watch clips as MP4, in the best quality Facebook provides.',
    steps: [
      { title: 'Copy the Facebook link', text: 'Press Share on the video and choose Copy link. fb.watch short links work too.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the available qualities.' },
      { title: 'Download', text: 'Pick a quality and save the MP4, or use the Audio tab for MP3.' },
    ],
    features: [
      { icon: 'quality', title: 'HD when available', text: 'Every quality Facebook offers for the video is listed, so you can choose between size and sharpness.' },
      { icon: 'play', title: 'Videos, Reels and Watch', text: 'Public videos from pages, profiles, Reels and Facebook Watch are supported.' },
      { icon: 'music', title: 'Audio only', text: 'Save a speech, song or interview as MP3, M4A, WAV or FLAC.' },
      { icon: 'shield', title: 'No login requested', text: 'We never ask for your Facebook account details.' },
    ],
    specs: {
      heading: 'Facebook details',
      rows: [
        ['Works with', 'Public videos, Reels and Watch links'],
        ['Does not work with', 'Private posts, closed groups and friends-only videos'],
        ['Format', 'MP4 video or MP3 / M4A / WAV / FLAC audio'],
        ['Captions', 'Facebook rarely provides caption tracks, so a transcript is usually not available'],
      ],
    },
    faqs: [
      { q: 'Why can’t I download a video from a group?', a: 'Videos in private or closed groups are visible only to members, so they cannot be reached from the public web.' },
      { q: 'The video has sound on Facebook but my file is silent. Why?', a: 'This is rare and usually means Facebook served the audio separately and it could not be merged. Try a different quality from the list.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['instagram-downloader', 'video-downloader', 'mp3-converter', 'bulk-downloader'],
  },
  {
    slug: 'pinterest-downloader',
    group: 'platform',
    navLabel: 'Pinterest Downloader',
    title: 'Pinterest Video Downloader – Save Pins as MP4',
    description:
      'Download Pinterest videos and Idea Pins as MP4. Paste the pin link and save the video in seconds — free, no account and no app.',
    h1: 'Pinterest Video Downloader',
    lead: 'Save video pins to your device as MP4 so your inspiration is available offline.',
    steps: [
      { title: 'Copy the pin link', text: 'Open the video pin, press the share icon and choose Copy link. pin.it short links work too.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the video.' },
      { title: 'Download', text: 'Choose a quality and save the MP4.' },
    ],
    features: [
      { icon: 'play', title: 'Video pins as MP4', text: 'Recipes, tutorials, DIY and design clips are saved as standard MP4 files.' },
      { icon: 'image', title: 'Cover image too', text: 'The Thumbnail tab lets you save the pin’s cover image.' },
      { icon: 'music', title: 'Audio only', text: 'Extract the soundtrack or voice-over as MP3.' },
      { icon: 'device', title: 'Any device', text: 'Works in the browser on phone, tablet and desktop.' },
    ],
    specs: {
      heading: 'Pinterest details',
      rows: [
        ['Works with', 'Public video pins'],
        ['Does not work with', 'Secret boards and image-only pins'],
        ['Format', 'MP4 video or MP3 audio'],
        ['Links', 'Full pinterest.com links and pin.it short links'],
      ],
    },
    faqs: [
      { q: 'Can I download image pins?', a: 'This tool is built for video. For an image pin, Pinterest’s own Download image option is the quickest route.' },
      { q: 'Why does a pin fail to load?', a: 'The pin is on a secret board, was removed, or links out to a video hosted on another site. In the last case, try that site’s link instead.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['instagram-downloader', 'video-downloader', 'thumbnail-downloader', 'bulk-downloader'],
  },
  {
    slug: 'twitter-downloader',
    group: 'platform',
    navLabel: 'Twitter / X Downloader',
    title: 'Twitter (X) Video Downloader – MP4',
    description:
      'Download videos and GIFs from Twitter / X as MP4. Paste the post link, choose a quality and save — free, no login and no app.',
    h1: 'Twitter / X Video Downloader',
    lead: 'Save videos from public posts on X (Twitter) as MP4, in any quality the post offers.',
    steps: [
      { title: 'Copy the post link', text: 'Press the share icon on the post and choose Copy link. Both x.com and twitter.com links work.' },
      { title: 'Paste it on the homepage', text: 'Paste the link into the box on the Clip Converter homepage and press Get Clip to load the available qualities.' },
      { title: 'Download', text: 'Pick a resolution and save the MP4.' },
    ],
    features: [
      { icon: 'quality', title: 'Every available quality', text: 'X encodes each video at several sizes; all of them are listed so you can balance quality and file size.' },
      { icon: 'play', title: 'GIFs as MP4', text: 'Animated GIFs on X are really short videos, and are saved as MP4 files.' },
      { icon: 'music', title: 'Audio only', text: 'Keep just the sound of a clip as MP3, M4A, WAV or FLAC.' },
      { icon: 'list', title: 'Batch downloads', text: 'Paste up to 25 post links and download them together.' },
    ],
    specs: {
      heading: 'X / Twitter details',
      rows: [
        ['Works with', 'Public posts that contain a video or GIF'],
        ['Does not work with', 'Protected accounts and posts that require sign-in to view'],
        ['Format', 'MP4 video or MP3 audio'],
        ['Links', 'x.com and twitter.com'],
      ],
    },
    faqs: [
      { q: 'Why does a post fail to load?', a: 'The account is protected, the post was deleted, or X requires a login to view it (common for sensitive-content labels).' },
      { q: 'Which quality should I pick?', a: 'The largest resolution in the list is the original upload. Smaller ones are useful for messaging apps with file-size limits.' },
      FAQ_FREE,
      FAQ_LEGAL,
    ],
    related: ['video-downloader', 'tiktok-downloader', 'bulk-downloader', 'mp3-converter'],
  },
];

export const TOOL_BY_SLUG = Object.fromEntries(TOOL_PAGES.map((p) => [p.slug, p]));
export const FEATURE_TOOLS = TOOL_PAGES.filter((p) => p.group === 'tool');
export const PLATFORM_TOOLS = TOOL_PAGES.filter((p) => p.group === 'platform');
