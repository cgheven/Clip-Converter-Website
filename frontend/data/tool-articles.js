/** Long-form article copy for each page in data/tool-pages.js, keyed by slug.
 * `intro` answers "what is this?"; `sections` are further H2 blocks. A section
 * has `paragraphs` and, optionally, a bullet `list`. Same rule as the page
 * data: describe only what the product really does. */

export const TOOL_ARTICLES = {
  'video-downloader': {
    introHeading: 'What is an online video downloader?',
    intro: [
      'An online video downloader is a website that takes the link of a video and gives you back a file you can keep. Instead of streaming the video again every time you want to watch it, you save it once to your phone or computer and play it whenever you like — on a flight, in a classroom with poor Wi-Fi, or inside a video editor.',
      'Clip Converter does this entirely in the browser. There is no program to install and no account to create. You paste a link, the site reads which qualities the platform offers for that video, and you choose the one you want. The result is a standard MP4 file, the format that virtually every phone, television, laptop and editing application can open.',
    ],
    sections: [
      {
        heading: 'How video quality and file size are related',
        paragraphs: [
          'Resolution describes how many pixels a video frame contains. 720p is 1280×720 pixels, 1080p (Full HD) is 1920×1080, 1440p is 2560×1440 and 2160p (4K) is 3840×2160. Each step up roughly doubles the amount of picture information, and the file grows with it. A ten-minute video that is 60 MB at 720p can easily be 250 MB or more at 4K.',
          'The best choice depends on where you will watch. For a phone screen, 720p is usually indistinguishable from higher resolutions and downloads much faster. For a laptop or television, 1080p is the sensible default. 4K is worth the wait only when you will watch on a large 4K display or need the extra detail for editing and cropping.',
          'A downloader can never add quality that the uploader did not provide. If a video was uploaded in 720p, that is the highest option you will see. The list on the result page always reflects what actually exists for that specific video.',
        ],
      },
      {
        heading: 'Why MP4 is the format you want',
        paragraphs: [
          'Video platforms store their files in several formats, including WebM with the VP9 or AV1 codecs. These are efficient, but older televisions, many car systems and some editing software refuse to play them. MP4 with H.264 video and AAC audio has no such problem — it has been the universal standard for more than fifteen years.',
          'Whenever the platform offers an H.264 version, Clip Converter picks it, and the video and audio are combined into a single MP4 for you. You do not need to install codec packs or convert the file a second time.',
        ],
      },
      {
        heading: 'Common reasons people download videos',
        list: [
          'Watching offline while travelling or where mobile data is expensive.',
          'Keeping a copy of your own uploads when the original file has been lost.',
          'Saving tutorials, lectures and courses to study without interruptions.',
          'Collecting reference footage for editing, presentations or teaching.',
          'Archiving a video that may be removed or made private later.',
        ],
      },
    ],
  },

  'mp3-converter': {
    introHeading: 'What is a video to MP3 converter?',
    intro: [
      'A video to MP3 converter extracts the sound from a video and saves it as an audio file. A large share of what people watch online is really listened to — music, podcasts, interviews, lectures, sermons, language lessons. Keeping the picture for that kind of content wastes storage and battery. An audio file is a fraction of the size and plays with the screen off.',
      'With Clip Converter you paste the link of the video, open the Audio tab and choose a format. The site fetches the best audio stream the platform provides, converts it and hands you the file. It works from any browser, on a computer or a phone, without an account.',
    ],
    sections: [
      {
        heading: 'MP3, M4A, WAV and FLAC explained',
        paragraphs: [
          'MP3 is the most widely supported audio format in the world. Every music player, car stereo, phone and smart speaker can play it, which makes it the safe choice when you are not sure where the file will end up.',
          'M4A uses the more modern AAC codec. At the same file size it generally sounds slightly better than MP3, and it is the native format of Apple devices. If you live in the iPhone and Mac world, M4A is an excellent pick.',
          'WAV is uncompressed audio. Files are large — around 10 MB per minute — but nothing is thrown away when the file is written. That matters if you are going to edit the sound in a DAW or a video editor, because every additional lossy save reduces quality. FLAC gives you the same lossless result at roughly half the size of WAV, and is the usual choice for archiving.',
        ],
      },
      {
        heading: 'An honest note about audio quality',
        paragraphs: [
          'Online platforms already compress their audio before you ever press play, typically to somewhere between 128 and 160 kbps. A converter cannot recover detail that was removed at that stage. Sites that advertise “320 kbps” conversions are simply writing a bigger file around the same sound.',
          'What a good converter can do is avoid making things worse: start from the highest-quality stream available and encode it once, carefully. That is exactly what happens here. Choosing WAV or FLAC will not make the music sound better than MP3 to your ears, but it does protect the audio from further loss if you plan to edit it.',
        ],
      },
      {
        heading: 'Saving only the part you need',
        paragraphs: [
          'Long recordings often contain one section you actually want — a single song in a one-hour mix, one question in a two-hour interview. Press Trim before downloading, set the start and end times, and only that portion is converted. The file is smaller, and you skip the step of cutting it in an audio editor afterwards.',
        ],
      },
    ],
  },

  transcript: {
    introHeading: 'What is a YouTube transcript generator?',
    intro: [
      'A transcript is the spoken content of a video written out as text. A YouTube transcript generator reads the caption track attached to a video and turns it into clean, readable text that you can search, copy, quote and reuse. Reading is several times faster than listening, so a transcript lets you get the substance of a one-hour talk in a few minutes.',
      'Clip Converter lists every caption language a video offers — captions written by the creator, captions generated automatically by YouTube’s speech recognition, and YouTube’s automatic translations. You pick a language, read the transcript on the page with its timestamps, and copy it or download it as a plain text file.',
    ],
    sections: [
      {
        heading: 'Who uses video transcripts?',
        list: [
          'Students, who turn lectures into searchable notes and find the exact minute a concept was explained.',
          'Writers and marketers, who repurpose a video into a blog post, newsletter, show notes or social captions.',
          'Researchers and journalists, who need to quote a speaker accurately and cite the timestamp.',
          'Language learners, who read along while listening to catch words they missed.',
          'People who are deaf or hard of hearing, or anyone in a place where sound cannot be played.',
        ],
      },
      {
        heading: 'Creator captions and auto-generated captions',
        paragraphs: [
          'Captions written or reviewed by the creator are normally very accurate, with correct punctuation, names and technical terms. Auto-generated captions are produced by speech recognition. They are remarkably good for clear speech in a quiet room and noticeably weaker with background music, strong accents, several people talking at once, or specialist vocabulary.',
          'Auto-captions also arrive as a rolling stream in which the same words are repeated from line to line. Clip Converter removes that duplication so the text reads like normal sentences rather than a stuttering feed. When both a creator track and an automatic track exist for a language, the creator version is used.',
        ],
      },
      {
        heading: 'When no transcript is available',
        paragraphs: [
          'The tool reads captions that the platform already has; it does not listen to the audio and transcribe it from scratch. If a creator has disabled captions and YouTube has not generated automatic ones — which is common for music videos, very recent uploads, and videos without clear speech — there is nothing to read, and the page will tell you so.',
          'For the same reason, transcripts are rarely available for Instagram, Facebook or TikTok videos. Those platforms seldom expose a caption track. YouTube is where transcript extraction works reliably.',
        ],
      },
    ],
  },

  'subtitle-downloader': {
    introHeading: 'What is a subtitle downloader?',
    intro: [
      'Subtitles are timed lines of text that appear on screen in step with the speech in a video. A subtitle downloader saves those lines, together with their timings, as a separate file. You can then load the file in a media player next to a downloaded video, import it into a video editor, or use it as the starting point for a translation.',
      'Clip Converter shows every subtitle language a video has and marks automatic tracks clearly, so you know whether you are getting captions a person wrote or captions produced by speech recognition. You can preview the lines on the page before saving the file.',
    ],
    sections: [
      {
        heading: 'Subtitles, closed captions and transcripts',
        paragraphs: [
          'The three terms are often mixed up. Subtitles assume you can hear the audio and only need the dialogue in text, often in another language. Closed captions are written for viewers who cannot hear the audio and may also describe sounds such as music or laughter. On YouTube both are delivered the same way, as a caption track.',
          'A transcript is the same text with the timings removed, arranged for reading rather than for display on top of a video. If you want to read or quote what was said, use the Transcript tab. If you want text that appears in sync with the picture, you need a subtitle file.',
        ],
      },
      {
        heading: 'About the VTT format',
        paragraphs: [
          'Files are saved as WebVTT (.vtt), the subtitle standard of the web. It is supported by every HTML5 video player, by VLC and most other desktop players, and by editors such as Premiere Pro, DaVinci Resolve and CapCut.',
          'Some older software only accepts SRT. The two formats are nearly identical, and any free subtitle editor converts VTT to SRT in a couple of clicks without losing timings.',
        ],
      },
      {
        heading: 'Using a subtitle file with a video',
        paragraphs: [
          'The simplest method is to put the subtitle file in the same folder as the video and give both the same name — for example lecture.mp4 and lecture.vtt. VLC and most players will load the subtitles automatically. In a video editor, import the file as captions and it will be placed on the timeline with the correct timings.',
        ],
      },
    ],
  },

  'thumbnail-downloader': {
    introHeading: 'What is a thumbnail downloader?',
    intro: [
      'A thumbnail is the cover image shown for a video in search results, recommendations and playlists. Platforms store it as an ordinary image file, but they give viewers no button to save it. A thumbnail downloader finds that image and lets you save it at full size.',
      'Paste a video link into Clip Converter and open the Thumbnail tab. Every size the platform has is listed with a preview, so you can see what you are getting before you download. The saved file is named after the video’s title, which keeps a folder of thumbnails easy to navigate.',
    ],
    sections: [
      {
        heading: 'Thumbnail sizes explained',
        paragraphs: [
          'YouTube keeps several versions of each thumbnail. The largest, usually 1280×720 pixels, is the one creators upload and the one you want for anything that will be viewed at a decent size. Smaller versions (640×480, 480×360, 320×180) exist so that lists and mobile screens load quickly.',
          'Not every video has the largest size. Older uploads and videos whose thumbnail was auto-selected from a low-resolution frame may only offer the smaller versions. The list always shows what genuinely exists for that video.',
        ],
      },
      {
        heading: 'What people use thumbnails for',
        list: [
          'Studying which designs earn clicks in a niche before creating your own.',
          'Illustrating an article, review or presentation that discusses the video.',
          'Recovering the thumbnail of your own video when the design file is gone.',
          'Building a visual index of a course, a channel or a research collection.',
        ],
      },
      {
        heading: 'Copyright and fair use',
        paragraphs: [
          'A thumbnail is a creative work and belongs to whoever made it. Looking at one for inspiration, or showing it while you comment on or review the video, is normally acceptable. Taking another creator’s thumbnail and presenting it as your own is not, and platforms act on those complaints.',
        ],
      },
    ],
  },

  'video-trimmer': {
    introHeading: 'What is an online video trimmer?',
    intro: [
      'A video trimmer cuts a section out of a longer video. Most trimmers make you download the entire file first and then cut it in an editor — slow and wasteful when you want thirty seconds of a two-hour stream. Clip Converter trims at the source: you set a start time and an end time, and only that section is fetched and saved.',
      'The clip can be saved as MP4 video in any listed quality, or as audio in MP3, M4A, WAV or FLAC. Everything happens in the browser, and the finished file has “-trim” in its name so you can tell it apart from a full download.',
    ],
    sections: [
      {
        heading: 'How the trimmer works',
        paragraphs: [
          'After you paste a link, press Trim. A timeline appears with two handles that you can drag to the beginning and end of the part you want. If you know the exact times, type them instead — 1:30 and 2:45, or 1:02:10 for videos longer than an hour. Press Apply Trim, then choose a quality and download.',
          'Because only the selected part is downloaded, a short clip from a very long video is usually ready in a small fraction of the time a full download would take.',
        ],
      },
      {
        heading: 'Why a clip may start slightly early',
        paragraphs: [
          'Compressed video does not store every frame in full. It stores a complete picture, called a keyframe, every second or two, and describes the frames in between as changes from it. A clip can only begin cleanly on a keyframe.',
          'There are two ways to deal with that. One is to re-encode the clip, which allows a frame-exact start but reduces quality and takes much longer. The other is to cut at the nearest keyframe and copy the video untouched. Clip Converter uses the second approach, so your clip keeps the exact quality of the original and may start up to about a second before the time you entered. Audio-only clips are cut exactly.',
        ],
      },
      {
        heading: 'Good uses for trimming',
        list: [
          'Pulling one highlight out of a long live stream or match.',
          'Saving a single song from a mix or a single answer from an interview.',
          'Extracting one chapter of a tutorial to share with a colleague.',
          'Creating short reference clips for teaching, review or commentary.',
        ],
      },
    ],
  },

  'playlist-downloader': {
    introHeading: 'What is a playlist downloader?',
    intro: [
      'A playlist downloader saves many videos from one link. Rather than opening twenty videos and pasting twenty URLs, you paste the address of the playlist once. Clip Converter reads the list, shows each video with its title, thumbnail and duration, and lets you choose which ones to keep.',
      'You decide once whether you want video (MP4) or audio (MP3), and that choice is applied to every item you select. Each file is saved separately under its own title, so the first videos are usable while the rest are still being prepared.',
    ],
    sections: [
      {
        heading: 'Playlists, channels and what counts as one',
        paragraphs: [
          'Any public or unlisted YouTube playlist works, including the “Uploads” list that every channel has. A channel’s Videos, Shorts or Streams page is handled in the same way, which is useful when a creator has never organised their work into playlists.',
          'Private playlists cannot be read, because they are only visible to the signed-in owner. If a playlist is yours, switch it to Unlisted for a moment, download, and switch it back.',
        ],
      },
      {
        heading: 'Limits and how the queue works',
        paragraphs: [
          'The first 100 videos of a playlist are listed. That keeps the page fast and prevents accidental downloads of a channel with thousands of uploads. For longer playlists, work through them in parts or use the bulk tool with individual links.',
          'Preparing a video takes real server work, especially at high resolution. To keep speeds reliable for everyone, files are processed a few at a time and the remainder wait in a queue. You can see the position and progress of every item, and queued files start on their own — you do not need to keep clicking.',
        ],
      },
      {
        heading: 'Typical uses',
        list: [
          'Saving an entire course or tutorial series for offline study.',
          'Turning a music or podcast playlist into MP3 files for a phone.',
          'Backing up your own channel before closing or restructuring it.',
          'Collecting conference talks or lectures for a research project.',
        ],
      },
    ],
  },

  'bulk-downloader': {
    introHeading: 'What is a bulk video downloader?',
    intro: [
      'A bulk downloader accepts many links at once. If you have a list of videos saved in a note, a spreadsheet or a chat — perhaps from several different platforms — pasting them one by one is tedious. With Clip Converter you switch the input box to “Paste multiple links”, add up to 25 URLs with one per line, and receive a single list you can download from.',
      'The links do not need to come from the same site. A YouTube video, a TikTok, an Instagram Reel and a Facebook clip can share a batch. Every link is checked individually, so one broken or private URL never stops the others.',
    ],
    sections: [
      {
        heading: 'Bulk links or a playlist link?',
        paragraphs: [
          'Use a playlist or channel link whenever the videos already live together on the platform: one URL gives you up to 100 videos with no collecting required. Use bulk mode when the videos are scattered — different channels, different platforms, or a hand-picked selection.',
        ],
      },
      {
        heading: 'Downloading several qualities of one video',
        paragraphs: [
          'Bulk downloading also works in the other direction. On the result page of a single video you can tick several rows — for example 1080p, 720p and MP3 — and download them together. Editors use this to keep a high-quality master and a small preview copy; teachers use it to offer both a video and an audio version of a lesson.',
        ],
      },
      {
        heading: 'What to expect while a batch runs',
        paragraphs: [
          'Each item shows its own state: queued, downloading, merging or finished. The server prepares a limited number of files at once so that everyone gets a dependable speed, and the rest start automatically as slots free up. Files are delivered one by one instead of as a ZIP archive, which means you never wait for the slowest video before you can use the fastest.',
        ],
      },
    ],
  },

  'tags-extractor': {
    introHeading: 'What is a YouTube tag extractor?',
    intro: [
      'Tags are keywords a creator attaches to a video at upload to describe its topic. YouTube used to display them and no longer does, but they are still part of the public data of the page. A tag extractor reads that data and shows you the complete list.',
      'Paste a video link into Clip Converter and the tags appear with the video’s title and description. One click copies them as a comma-separated list, ready to paste into a spreadsheet, a notes app or the tag box in YouTube Studio.',
    ],
    sections: [
      {
        heading: 'Do tags still matter for YouTube SEO?',
        paragraphs: [
          'Less than they once did, and it is worth being honest about it. YouTube’s own guidance says tags play a minimal role in discovery and are chiefly useful when the subject of a video is commonly misspelled. The title, the thumbnail, the description and above all how long people keep watching carry far more weight.',
          'Tags are still valuable as a research tool. They reveal, in the creator’s own words, which search phrases a successful video was aimed at. Compare the tags of the five best-ranking videos for a topic and you quickly see the vocabulary your audience uses — phrases you can then work into your own titles and descriptions, where they count.',
        ],
      },
      {
        heading: 'How to use extracted tags well',
        list: [
          'Look for tags that repeat across several top videos — those are the core terms of the niche.',
          'Note long, specific phrases; they indicate less competitive searches worth targeting.',
          'Use only tags that truly describe your video. Misleading tags violate YouTube’s policies.',
          'Keep a running spreadsheet, using the CSV export, to build a keyword list over time.',
        ],
      },
      {
        heading: 'When a video shows no tags',
        paragraphs: [
          'Tags are optional, and many channels — including some very large ones — leave them empty. If nothing is listed, the creator did not add any; it is not an error. The title and description of such videos are usually where their keyword work has gone, and both can be copied from the same result page.',
        ],
      },
    ],
  },

  'metadata-extractor': {
    introHeading: 'What is video metadata?',
    intro: [
      'Metadata is the information that describes a video rather than the video itself: its title, description, tags, channel, duration, resolution, number of views, upload date and chapters. It is what platforms use to index a video, and what you need whenever you catalogue, analyse or cite one.',
      'Clip Converter gathers these fields from a video link and exports them as a file. Choose JSON if the data is going into a script or an application, or CSV if it is going into Excel, Google Sheets or a report.',
    ],
    sections: [
      {
        heading: 'JSON or CSV?',
        paragraphs: [
          'CSV is a plain table: one column per field. It opens directly in any spreadsheet program, which makes it ideal for building a list of videos to sort, filter and chart. Several CSV exports can be pasted under one another to form a single sheet.',
          'JSON keeps structure. A video’s chapters, for example, are a list inside the record, each with a title and a start time — something a flat table cannot express neatly. Developers and anyone feeding the data to another program will prefer JSON, and it is the only export that includes chapters.',
        ],
      },
      {
        heading: 'Who needs a metadata extractor?',
        list: [
          'Researchers and librarians cataloguing video sources with accurate titles and dates.',
          'Marketers auditing competitors’ titles, descriptions and tags across a niche.',
          'Archivists recording the details of a video before it disappears.',
          'Developers who want clean video data without registering for an API key.',
        ],
      },
      {
        heading: 'Why some fields are empty',
        paragraphs: [
          'Platforms differ in what they publish. YouTube exposes nearly everything. Instagram, TikTok and Facebook often omit view counts, tags or exact upload dates. When a platform does not provide a field, the export leaves it blank rather than guessing, so the data you collect is always trustworthy.',
        ],
      },
    ],
  },

  'chapters-extractor': {
    introHeading: 'What are YouTube chapters?',
    intro: [
      'Chapters divide a video into named sections, each beginning at a timestamp. They appear as segments on the progress bar and let viewers jump straight to the part they care about. Creators add them by writing a list of timestamps in the description; YouTube can also generate them automatically.',
      'A chapters extractor pulls that list out as text. Paste a link into Clip Converter and, if the video has chapters, they are shown with their start times. One click copies the full list in the familiar “0:00 Introduction” layout.',
    ],
    sections: [
      {
        heading: 'What a chapter list is good for',
        list: [
          'An instant outline of a lecture, tutorial or documentary for your notes.',
          'Show notes for a podcast page or a newsletter.',
          'A table of contents when you embed or reference a video in an article.',
          'Recovering the chapters of your own video when you need them elsewhere.',
        ],
      },
      {
        heading: 'Downloading a single chapter',
        paragraphs: [
          'Chapters pair naturally with the trimmer. Note the start time of the chapter you want and the start time of the one after it, press Trim, enter the two times and download. You get that chapter alone, as video or as audio, without fetching the rest of the video.',
        ],
      },
      {
        heading: 'Adding chapters to your own videos',
        paragraphs: [
          'YouTube recognises chapters when the description contains a list of timestamps that starts at 0:00, has at least three entries in ascending order, and leaves at least ten seconds between them. The list copied from Clip Converter already follows this format, so a recovered list can be pasted directly into a description.',
          'If a video shows no Chapters section, it simply has none. They exist only when the creator wrote them or YouTube generated them.',
        ],
      },
    ],
  },

  'youtube-downloader': {
    introHeading: 'What is a YouTube video downloader?',
    intro: [
      'A YouTube video downloader saves a YouTube video to your device as a file, so that you can watch it without a connection, keep a copy of your own work, or use the footage in a project you have the rights to. Clip Converter does this from the browser: copy the link, paste it, choose a resolution, download.',
      'It is also more than a video saver. From the same link you can take the audio as MP3, the subtitles in any available language, a readable transcript, the thumbnail in full size, the chapter list, the tags and the complete metadata. One paste, everything the video has to offer.',
    ],
    sections: [
      {
        heading: 'Why high resolutions take longer',
        paragraphs: [
          'Up to 720p, YouTube can serve picture and sound together as one file. Above that — 1080p, 1440p and 4K — it stores the video and the audio as two separate streams. A downloader must fetch both and join them, a step called muxing, before there is a playable file.',
          'Clip Converter does that work on the server and gives you a single finished MP4. It is the reason a 4K download shows a “merging” stage and takes noticeably longer than 720p. The progress indicator on the button tells you which stage the file is in.',
        ],
      },
      {
        heading: 'Which YouTube links work',
        paragraphs: [
          'Standard watch links, youtu.be short links, Shorts, playlists and channel pages are all accepted. Live streams can be saved after they end and YouTube has finished processing the recording; a broadcast that is still live cannot be downloaded.',
          'Videos that require a signed-in account — private, members-only, age-restricted or blocked in the server’s region — cannot be reached. Clip Converter never asks for your Google login, and you should be wary of any site that does.',
        ],
      },
      {
        heading: 'Using downloads responsibly',
        paragraphs: [
          'Downloading your own videos, Creative Commons material, public-domain content, and videos you have permission to use is straightforward. For everything else, YouTube’s terms of service and copyright law apply. Keeping a lecture to study offline is a very different thing from re-uploading someone else’s work — the responsibility for how a file is used rests with you.',
        ],
      },
    ],
  },

  'youtube-to-mp3': {
    introHeading: 'What is a YouTube to MP3 converter?',
    intro: [
      'A YouTube to MP3 converter takes the sound of a YouTube video and saves it as an MP3 file. YouTube holds an enormous amount of content that people only listen to — podcasts, interviews, lectures, audiobooks, live sets, ambient sound — and an MP3 lets you play it in any music app, with the screen off, without using mobile data.',
      'On Clip Converter you paste the link, open the Audio tab and press Download next to MP3. M4A, WAV and FLAC are there as well if you prefer them. It runs in the browser on Windows, Mac, Android and iPhone.',
    ],
    sections: [
      {
        heading: 'The truth about “320 kbps”',
        paragraphs: [
          'Many converters promise 320 kbps MP3s. YouTube’s own audio streams are compressed to roughly 128–160 kbps before you ever receive them, so a 320 kbps file made from that source is just a larger container around the same sound. No detail is added.',
          'Clip Converter takes YouTube’s best audio stream and encodes it once with a high-quality variable bitrate. The result is as good as the source allows, without inflated file sizes or inflated claims.',
        ],
      },
      {
        heading: 'Trimming and playlists',
        paragraphs: [
          'Press Trim to keep only part of a recording: one track of a DJ set, one chapter of an audiobook, one answer in an interview. Audio clips are cut exactly at the times you enter.',
          'For a music or podcast playlist, paste the playlist link, choose Audio (MP3) and select the tracks. Up to 100 items are listed, and each is saved under its own title.',
        ],
      },
      {
        heading: 'Is converting YouTube to MP3 legal?',
        paragraphs: [
          'It depends on what you convert. Your own uploads, royalty-free and Creative Commons audio, public-domain recordings and content you have permission to use are fine. Commercial music is protected by copyright, and downloading it without permission may break the law where you live as well as YouTube’s terms. You are responsible for choosing what to convert.',
        ],
      },
    ],
  },

  'youtube-shorts-downloader': {
    introHeading: 'What is a YouTube Shorts downloader?',
    intro: [
      'YouTube Shorts are vertical videos of up to a few minutes, made for phones. The YouTube app lets you save them for offline viewing inside the app, but not as a file you can move, edit or keep. A Shorts downloader gives you the real MP4.',
      'Copy the link of the Short from the Share menu, paste it into Clip Converter and choose a quality. The video is saved in its original 9:16 vertical shape, with no watermark added. If it is the sound you want, the Audio tab saves it as MP3.',
    ],
    sections: [
      {
        heading: 'Quality and format',
        paragraphs: [
          'Most Shorts are uploaded at 1080×1920. Every resolution that exists for the Short is listed, and the file is a standard MP4 that plays on any phone and imports cleanly into CapCut, InShot, Premiere and other editors.',
          'Unlike some platforms, YouTube does not burn a logo or username into the video, so the downloaded Short is clean by default.',
        ],
      },
      {
        heading: 'Saving several Shorts at once',
        paragraphs: [
          'Paste the address of a channel’s Shorts page to list its videos and download the ones you select. Alternatively, switch to “Paste multiple links” and add up to 25 Shorts links from different channels in one batch.',
        ],
      },
      {
        heading: 'Reposting: what is allowed',
        paragraphs: [
          'Creators most often download their own Shorts to publish them on TikTok or Instagram Reels, which is entirely fine. Reposting another person’s Short without permission is not: it infringes their copyright, and platforms remove such uploads and penalise the accounts behind them. Use other people’s work for reference, commentary or inspiration, and ask before you reuse it.',
        ],
      },
    ],
  },

  'tiktok-downloader': {
    introHeading: 'What is a TikTok video downloader?',
    intro: [
      'A TikTok downloader saves a TikTok video as an MP4 file using nothing but its link. TikTok’s own Save button is frequently switched off by the creator, and even when it works the video stays tied to the app. With a downloader you get a normal file you can keep, send or edit.',
      'Open the video, press Share, choose Copy link and paste it into Clip Converter. Both full tiktok.com addresses and the short vm.tiktok.com links work. No TikTok account is needed, and the site never asks for one.',
    ],
    sections: [
      {
        heading: 'Saving TikTok sounds as MP3',
        paragraphs: [
          'A great deal of TikTok is about the sound — a song clip, a voice-over, a meme audio. The Audio tab extracts just that and saves it as MP3, M4A, WAV or FLAC. It is a quick way to get a sound into an editing project.',
        ],
      },
      {
        heading: 'What works and what does not',
        paragraphs: [
          'Public videos work. Videos from private accounts cannot be downloaded, because they are visible only to approved followers. Videos that have been deleted, or removed by TikTok, are gone for everyone.',
          'TikTok occasionally restricts access from certain regions or changes how its pages are delivered. If a public video fails, waiting a little and trying again usually solves it.',
          'Captions and transcripts are available only for some TikTok videos, since the platform does not publish caption tracks consistently. When a video has none, those tabs do not appear.',
        ],
      },
      {
        heading: 'Respecting creators',
        paragraphs: [
          'Saving a video to watch later or to keep a copy of your own content is fine. Re-uploading someone else’s TikTok as your own is not — it is their work, and platforms treat reposts as copyright violations. When in doubt, credit the creator and ask first.',
        ],
      },
    ],
  },

  'instagram-downloader': {
    introHeading: 'What is an Instagram Reels downloader?',
    intro: [
      'Instagram lets you bookmark a Reel inside the app but offers no way to save it as a file. An Instagram downloader fills that gap: you supply the link of a public Reel or video post and receive an MP4 that you can keep on your device.',
      'Tap the share icon or the three-dot menu on the post, choose Copy link, and paste it into Clip Converter. The video is saved as a standard MP4, and the Audio tab can extract the sound on its own.',
    ],
    sections: [
      {
        heading: 'You never need to log in',
        paragraphs: [
          'Clip Converter does not ask for your Instagram username or password — not on any page, not for any feature. Be cautious with downloaders that do. Handing your login to a third-party site is the most common way Instagram accounts are stolen, and it is never necessary for saving a public video.',
        ],
      },
      {
        heading: 'Why Instagram links fail more often',
        paragraphs: [
          'Instagram is stricter than most platforms. Much of its content is shown only to signed-in users, and automated access is limited aggressively. As a rule of thumb: if the post opens in a private browser window where you are logged out, it can usually be downloaded. If Instagram shows a login wall instead, it cannot.',
          'Private accounts and Stories are out of reach for the same reason. The tool only sees what is visible to everyone on the public web.',
        ],
      },
      {
        heading: 'Common uses',
        list: [
          'Backing up your own Reels, especially when the original edit was made inside the app.',
          'Reposting your own content to TikTok or YouTube Shorts.',
          'Saving recipes, workouts and tutorials to follow offline.',
          'Gathering reference material for a mood board or a client presentation.',
        ],
      },
    ],
  },

  'facebook-downloader': {
    introHeading: 'What is a Facebook video downloader?',
    intro: [
      'Facebook has a “Save video” option, but it only adds the video to a list inside Facebook — nothing reaches your device. A Facebook video downloader gives you the file itself, as an MP4 you can watch offline, archive or send to someone who does not use Facebook.',
      'Press Share on the video, choose Copy link, and paste it into Clip Converter. Links from pages, profiles, Reels and Facebook Watch are accepted, including fb.watch short links.',
    ],
    sections: [
      {
        heading: 'SD and HD',
        paragraphs: [
          'Facebook usually keeps a video in a standard-definition and a high-definition version. Both are listed when they exist. HD is the better choice for anything you will watch on a larger screen; SD is smaller and handy for sharing over messaging apps with size limits.',
        ],
      },
      {
        heading: 'Public versus private videos',
        paragraphs: [
          'Only videos whose audience is set to Public can be downloaded. Videos shared with friends only, or posted in private and closed groups, are visible solely to people who are logged in and permitted to see them, so a web tool has no access to them.',
          'If the video is your own, the simplest route is to change its audience to Public for a moment, download it, and change it back.',
        ],
      },
      {
        heading: 'Audio from Facebook videos',
        paragraphs: [
          'Speeches, sermons, live music and interviews are often posted only on Facebook. The Audio tab saves the sound as MP3, M4A, WAV or FLAC, which is convenient for listening on the go. Transcripts are usually not available, as Facebook rarely publishes caption tracks.',
        ],
      },
    ],
  },

  'pinterest-downloader': {
    introHeading: 'What is a Pinterest video downloader?',
    intro: [
      'Pinterest has grown from a board of images into a home for short videos: recipes, craft and DIY tutorials, workouts, styling ideas. The app lets you save a pin to a board but not to your device. A Pinterest video downloader saves the video as an MP4, so your inspiration is available offline.',
      'Open the pin, tap the share icon, choose Copy link and paste it into Clip Converter. Both pinterest.com addresses and pin.it short links work.',
    ],
    sections: [
      {
        heading: 'Video pins and image pins',
        paragraphs: [
          'This tool is designed for pins that contain a video. For an image pin, Pinterest’s own “Download image” option in the three-dot menu is the quickest route.',
          'For video pins, the Thumbnail tab additionally lets you save the cover image — useful when you want a still for a mood board alongside the clip.',
        ],
      },
      {
        heading: 'When a pin will not load',
        list: [
          'The pin is on a secret board, visible only to its owner and collaborators.',
          'The pin has been deleted by its creator or removed by Pinterest.',
          'The pin is only a link to a video hosted elsewhere — paste that original link instead.',
        ],
      },
      {
        heading: 'Keeping it fair',
        paragraphs: [
          'Pins belong to the people who made them. Saving a tutorial to follow in your kitchen or workshop is ordinary personal use. Re-uploading someone’s video to your own account or using it commercially requires their permission.',
        ],
      },
    ],
  },

  'twitter-downloader': {
    introHeading: 'What is a Twitter / X video downloader?',
    intro: [
      'X, formerly Twitter, has no download button for videos in posts. A Twitter video downloader reads the post, finds the video file behind it and saves it to your device as an MP4.',
      'Tap the share icon on the post, choose Copy link and paste it into Clip Converter. Links from x.com and from twitter.com are treated identically.',
    ],
    sections: [
      {
        heading: 'Choosing a quality',
        paragraphs: [
          'X encodes each uploaded video at several resolutions so that it plays smoothly on slow connections. All of them are listed. The largest is the closest to the original upload; the smaller ones are useful when a messaging app limits file size.',
        ],
      },
      {
        heading: 'GIFs on X are really videos',
        paragraphs: [
          'When someone posts a GIF on X, the platform converts it into a short, silent, looping video, because video files are far smaller than true GIFs. That is why a “GIF” from X is saved here as an MP4. If you need an actual .gif file, any free converter will turn the MP4 into one.',
        ],
      },
      {
        heading: 'Posts that cannot be downloaded',
        paragraphs: [
          'Posts from protected accounts are visible only to approved followers. Posts that X hides behind a login — often those labelled as sensitive content — cannot be reached either, and deleted posts are gone. Public posts with an attached video generally work without trouble.',
          'As with every platform, the video belongs to whoever posted it. Save what you need for personal use, reporting or commentary, and ask before republishing.',
        ],
      },
    ],
  },
};
