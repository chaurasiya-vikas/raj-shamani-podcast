import { useState, useEffect, useCallback } from "react"

const PAST_GUESTS = `Kunal Shah, Sanjyot Keer, Ashok Ramachandran, Anant Ladha, Nikhil Kamath, Arjun Vaidya, CA Rachana Ranade, Vineeta Singh, Ashneer Grover, Ghazal Alagh, Harsh Mariwala, Anupam Mittal, Ranveer Allahbadia, Ritesh Agarwal, Kaivalya Vohra, Pranjal Kamra, Nithin Kamath, KING, Vishal Gondal, Trishneet Arora, Ankush Sachdeva, Peyush Bansal, Kunal Bahl, Byju Raveendran, Abhijit Iyer-Mitra, Abhishek Bachchan, MC Stan, Yo Yo Honey Singh, Palki Sharma, Armaan Malik, Vikram Sampath, Nitin Gadkari, Shivraj Singh Chouhan, Anil Agarwal, Raghuram Rajan, Zakir Khan, Bhuvan Bam, Namita Thapar, Ananth Narayanan, Pankaj Tripathi, Taapsee Pannu, Sanjana Sanghi, Digital Deepak, Pratham Mittal, Shashank Kumar, Sambhav Jain, Papa CJ, Ayush Jaiswal, Ritesh Malik, Sandeep Jethwani, Finance With Sharan, Srikanth Velamakanni, Harsh Pant, Sahil Bloom, Vandana Shah, Mukesh Bansal, Divya Gokulnath, Rana Daggubati, Ronnie Screwvala, Badshah, Karishma Mehta, Rajnish Kumar, Amit Jain, Sandeep Nailwal, Shantanu Deshpande, Akash Sinha, Deepak Garg, Rajiv Talreja, Anshul Rustaggi, Labour Law Advisor, Raj Das, Sumeet Mehta, Sanjeev Barnwal, NoBroker Founders, Anshuman Singh, Sai Krishna, Zeeshan Sheikh, Ashish Kashyap, Lakshyaraj Singh Mewar, Ex IPS Meeran Chadha Borwankar, Rajpal Yadav, Dinesh Thakkar, C Sivasankaran, Shefali Shah, Prashant Desai, Dr Jaishree Sharad, Col Danvir Singh, The Chainsmokers, Krish Ashok, Kartik Aaryan, Saloni Khanna, Diljit Dosanjh, Ali Fazal, Sunil Chhetri, Vipul Shah, Vicky Kaushal, Sabeer Bhatia, Rajkummar Rao, Tamannaah Bhatia, Praveen Teotia, Navdeep Singh, Kailash Kher, Lalit Modi, Ananya Panday, Arjun Kapoor, Aakash Gupta, Amit Trivedi, MrBeast, Sunidhi Chauhan, Farhan Akhtar, Kangana Ranaut, Baba Ramdev, Shahid Kapoor, Sanjiv Goenka, Martin Garrix, Khan Sir, Hussain Zaidi, Sohum Shah, Nani, Karan Johar, Bill Gates, Ramandeep Singh, Rakul Preet Singh, Aamir Khan, Vijay Mallya, Smriti Irani, Yuzi Chahal, Praggnanandhaa, Bharti Singh, Avadh Ojha, Karan Aujla, Rinku Singh, Shikhar Dhawan, Ishant Sharma, MS Dhoni, Falguni Pathak, Ravi Kishan, Anupam Kher, Abhinav Singh, Saurabh Mukherjea, Boman Irani, Himesh Reshammiya, Deepinder Goyal, Jack Dorsey, Simon Sinek, Michael Phelps, Sunita Williams, Shreya Ghosal, Joe Dispenza, Mark Manson, Lakshya Sen, Saurav Ganguly, Paresh Rawal, Nawazuddin Siddiqui, Jhanvi Kapoor, Ankur Warikoo, Vaibhav Sisinty, Kiara Advani, Ruchir Sharma, Karnal Singh, Col Shivender Kanwar, Dr Tarang Krishna, Lt Gen Shokin Chauhan, Vishal Mishra, Yashashwi Jaiswal, Vikas Divyakirti, Keshav Inani, Ashish Chanchlani, Shiv Shivakumar, Anu Malik, Pawan Sehrawat, Eric Nam, Jackson Wang, Jayant Sinha, Ajai Chowdhry, IAS Abhishek Singh, Srijan Pal Singh, Vivek Atray, Shantanu Gupta`

const CATEGORIES = [
  { id:"all", label:"Daily Mix", color:"#7c3aed" },
  { id:"cricketer", label:"Cricketer", color:"#059669" },
  { id:"politician", label:"Politician", color:"#dc2626" },
  { id:"actor", label:"Actor", color:"#d97706" },
  { id:"actress", label:"Actress", color:"#db2777" },
  { id:"singer", label:"Singer", color:"#7c3aed" },
  { id:"entrepreneur", label:"Entrepreneur", color:"#ca8a04" },
  { id:"startup", label:"Startup Founder", color:"#f97316" },
  { id:"business", label:"Business", color:"#2563eb" },
  { id:"techy", label:"Tech Expert", color:"#6366f1" },
  { id:"finance", label:"Finance/Investor", color:"#10b981" },
  { id:"economist", label:"Economist", color:"#0891b2" },
  { id:"doctor", label:"Doctor/Health", color:"#ef4444" },
  { id:"intellectual", label:"Intellectual/Author", color:"#8b5cf6" },
  { id:"lawyer", label:"Lawyer/Legal", color:"#6b7280" },
  { id:"comedian", label:"Comedian", color:"#f59e0b" },
  { id:"military", label:"Military/Defence", color:"#64748b" },
  { id:"spirituality", label:"Spirituality", color:"#a78bfa" },
  { id:"educator", label:"Educator/IAS", color:"#16a34a" },
  { id:"athlete", label:"Athlete", color:"#ea580c" },
  { id:"international", label:"International", color:"#0ea5e9" },
  { id:"social", label:"Social Media", color:"#ec4899" },
]

function App() {
  const [guests, setGuests] = useState([])
  const [categoryGuests, setCategoryGuests] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState(null)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [view, setView] = useState("home")
  const [research, setResearch] = useState("")
  const [questions, setQuestions] = useState("")
  const [outreach, setOutreach] = useState({ subject: "", body: "", recipientEmail: "" })
  const [whatsappMsg, setWhatsappMsg] = useState("")
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showApiInput, setShowApiInput] = useState(true)
  const [lastUpdated, setLastUpdated] = useState("")
  const [pipeline, setPipeline] = useState([])
  const [pipelineFilter, setPipelineFilter] = useState("All")
  const [pipelineSort, setPipelineSort] = useState("score")
  const [notes, setNotes] = useState({})
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedWA, setCopiedWA] = useState(false)
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  // Guest History Log
  const [guestHistory, setGuestHistory] = useState([])
  const [historyView, setHistoryView] = useState(false)
  // Episode Title Suggester
  const [titles, setTitles] = useState([])
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [titleGuest, setTitleGuest] = useState(null)
  const [showTitles, setShowTitles] = useState(false)
  // Pre-Interview Brief
  const [brief, setBrief] = useState("")
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [briefGuest, setBriefGuest] = useState(null)
  const [showBrief, setShowBrief] = useState(false)
  const [copiedBrief, setCopiedBrief] = useState(false)
  // Audience Alignment Score
  const [alignmentData, setAlignmentData] = useState({})
  const [loadingAlignment, setLoadingAlignment] = useState(null)
  // Global Search
  const [globalSearch, setGlobalSearch] = useState("")
  const [globalSearchResult, setGlobalSearchResult] = useState(null)
  const [loadingGlobalSearch, setLoadingGlobalSearch] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [plannerMonth, setPlannerMonth] = useState(new Date())
  const [comparedGuests, setComparedGuests] = useState([])
  // Trending Topics
  const [trends, setTrends] = useState([])
  const [loadingTrends, setLoadingTrends] = useState(false)
  const [trendGuests, setTrendGuests] = useState({})
  const [loadingTrendGuest, setLoadingTrendGuest] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  // Competitors
  const [competitors, setCompetitors] = useState([])
  const [loadingCompetitors, setLoadingCompetitors] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const shouldIncludeVaibhav = () => {
    const today = new Date()
    const lastVaibhav = localStorage.getItem("raj_vaibhav_last")
    if (!lastVaibhav) return true
    const lastDate = new Date(lastVaibhav)
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    return diffDays >= 15
  }

  const callOpenAI = async (prompt, key) => {
    const useKey = key || apiKey
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${useKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], max_tokens: 3000 })
    })
    const data = await res.json()
    return data.choices[0].message.content
  }

  const parseGuests = (text, count) => {
    const cleaned = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)
    const arr = Array.isArray(parsed) ? parsed : [parsed]
    return arr.slice(0, count).map(g => ({
      ...g,
      total: ((g.virality + g.relevance + g.value) / 3).toFixed(1),
      priority: ((g.virality + g.relevance + g.value) / 3) >= 8 ? "High" : ((g.virality + g.relevance + g.value) / 3) >= 6 ? "Medium" : "Low",
      status: "New",
      addedDate: new Date().toLocaleDateString('en-IN')
    }))
  }

  const generateGuests = useCallback(async (keyOverride) => {
    const useKey = keyOverride || apiKey
    if (!useKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoading(true); setView("home"); setActiveCategory("all")
    const recentGuests = JSON.parse(localStorage.getItem("raj_recent_guests") || "[]")
    const includeVaibhav = shouldIncludeVaibhav()
    const today = new Date()
    const vaibhavRule = includeVaibhav
      ? `VAIBHAV SISINTY: Include him as AI Tools expert. Topic: Latest AI tools for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.`
      : `VAIBHAV SISINTY: Do NOT include him (appeared less than 15 days ago). Same 15-day rule applies.`
    try {
      const text = await callOpenAI(`You are a podcast guest strategist for "Figuring Out With Raj Shamani" - India's top podcast 500+ episodes. Audience: young Indians 18-35.
PAST GUESTS (avoid completely): ${PAST_GUESTS}
SHOWN IN LAST 15 DAYS (STRICTLY avoid all of these - no repeats for 15 days): ${recentGuests.join(", ")}
${vaibhavRule}
PRIORITY GAPS: Virat Kohli, Rohit Sharma, Hardik Pandya, Sachin Tendulkar, Deepika Padukone, Priyanka Chopra, Shah Rukh Khan, Rahul Gandhi, Sundar Pichai, PV Sindhu, Neeraj Chopra
Suggest EXACTLY 15 guests for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.
Mix all categories. Every guest must add REAL VALUE to Indian society.
Return JSON array EXACTLY 15 items each with: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared("Never" or year), repeatReason, isAISlot(true only for Vaibhav)
ONLY valid JSON. EXACTLY 15 ITEMS. NO MARKDOWN.`, useKey)
      const withScores = parseGuests(text, 15)
      if (includeVaibhav) localStorage.setItem("raj_vaibhav_last", new Date().toISOString())
      // 15-day memory: store last 225 guests (15 days x 15 guests per day)
      localStorage.setItem("raj_recent_guests", JSON.stringify([...withScores.map(g => g.name), ...recentGuests].slice(0, 225)))
      const now = new Date().toLocaleString('en-IN')
      setGuests(withScores); setLastUpdated(now)
      // Save to guest history log
      const existingHistory = JSON.parse(localStorage.getItem("raj_guest_history") || "[]")
      const historyEntry = { date: now, guests: withScores.map(g => ({ name: g.name, category: g.category, total: g.total, priority: g.priority })) }
      const updatedHistory = [historyEntry, ...existingHistory].slice(0, 30)
      setGuestHistory(updatedHistory)
      localStorage.setItem("raj_guest_history", JSON.stringify(updatedHistory))
      localStorage.setItem("raj_guests", JSON.stringify(withScores))
      localStorage.setItem("raj_last_updated", now)
      localStorage.setItem("raj_last_date", new Date().toLocaleDateString('en-IN'))
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }, [apiKey])

  const generateCategoryGuests = async (cat) => {
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    if (cat.id === "all") { setActiveCategory("all"); setCategoryGuests([]); return }
    setActiveCategory(cat.id); setLoadingCategory(true); setCategoryGuests([])
    const allNames = [...guests, ...pipeline].map(g => g.name).join(", ")
    const recentGuests = JSON.parse(localStorage.getItem("raj_recent_guests") || "[]")
    try {
      const text = await callOpenAI(`Podcast guest strategist for "Figuring Out With Raj Shamani".
Category: ${cat.label}. Avoid: ${PAST_GUESTS}, ${recentGuests.join(", ")}, ${allNames}
Suggest EXACTLY 5 best ${cat.label} guests for ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.
Return EXACTLY 5 items JSON array each with: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared("Never" or year), repeatReason, isAISlot(false)
ONLY valid JSON. EXACTLY 5 ITEMS. NO MARKDOWN.`)
      setCategoryGuests(parseGuests(text, 5))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingCategory(false)
  }

  // ─── TRENDING TOPICS ───
  const fetchTrends = async () => {
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoadingTrends(true)
    setTrends([])
    setTrendGuests({})
    try {
      const text = await callOpenAI(`You are a news analyst for India. Today is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
List the TOP 8 trending topics in India RIGHT NOW across: politics, cricket, Bollywood, business, sports, social issues, technology, entertainment.
For each topic give a real current news angle.
Return ONLY valid JSON array of 8 items. Each item:
{ "topic": "short topic name", "headline": "one line current news about it", "category": "Politics/Cricket/Bollywood/Business/Sports/Tech/Entertainment/Social", "heat": 1-10 }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setTrends(Array.isArray(parsed) ? parsed : [])
    } catch (e) { alert("Error fetching trends: " + e.message) }
    setLoadingTrends(false)
  }

  const findGuestForTrend = async (trend) => {
    if (!apiKey) return
    setLoadingTrendGuest(trend.topic)
    try {
      const text = await callOpenAI(`Trending topic in India: "${trend.topic}" — ${trend.headline}
Which ONE podcast guest would be PERFECT for "Figuring Out With Raj Shamani" to discuss this trend?
Must NOT be from past guests: ${PAST_GUESTS}
Give someone who has direct expertise or connection to this trend.
Return ONLY valid JSON object:
{ "name": "", "category": "", "whyNow": "why they fit THIS trend", "topicAngle": "specific angle for this episode", "virality": 1-10, "relevance": 1-10, "value": 1-10, "lastAppeared": "Never", "repeatReason": "", "isAISlot": false }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const guest = { ...parsed, total: ((parsed.virality + parsed.relevance + parsed.value) / 3).toFixed(1), priority: ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 8 ? "High" : ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 6 ? "Medium" : "Low", status: "New", addedDate: new Date().toLocaleDateString('en-IN') }
      setTrendGuests(prev => ({ ...prev, [trend.topic]: guest }))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingTrendGuest(null)
  }


  // COMPETITORS INTELLIGENCE
  const COMPETITORS = [
    { name: "Ranveer Allahbadia", aka: "BeerBiceps", type: "India", edge: "Mass reach + content volume + multi-platform dominance", color: "#f59e0b" },
    { name: "Nikhil Kamath", aka: "WTF Podcast", type: "India", edge: "Elite network + founder/investor credibility", color: "#3b82f6" },
    { name: "Samdish Bhatia", aka: "Unfiltered by Samdish", type: "India", edge: "Deep research + tough questioning", color: "#8b5cf6" },
    { name: "Kamiya Jani", aka: "Curly Tales", type: "India", edge: "Brand collaborations + lifestyle audience", color: "#ec4899" },
    { name: "Sandeep Maheshwari", aka: "Sandeep Maheshwari", type: "India", edge: "Trust + emotional connection with audience", color: "#10b981" },
    { name: "Ankur Warikoo", aka: "Warikoo Podcast", type: "India", edge: "Young professionals audience + career advice niche", color: "#f97316" },
    { name: "Joe Rogan", aka: "JRE", type: "Global", edge: "Global influence + long-form dominance", color: "#ef4444" },
    { name: "Steven Bartlett", aka: "Diary of a CEO", type: "Global", edge: "Storytelling + high production + global branding", color: "#06b6d4" },
    { name: "Lex Fridman", aka: "Lex Fridman Podcast", type: "Global", edge: "Intellectual depth + high-quality conversations", color: "#6366f1" },
    { name: "Jay Shetty", aka: "On Purpose", type: "Global", edge: "Global relatability + personal development", color: "#84cc16" },
  ]

  const fetchCompetitors = async () => {
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoadingCompetitors(true)
    setCompetitors([])
    try {
      const text = await callOpenAI(`You are a podcast intelligence analyst. For each of these 10 podcast shows list their 3 most recent notable guests based on your knowledge. Shows: Ranveer Allahbadia BeerBiceps, Nikhil Kamath WTF Podcast, Samdish Bhatia Unfiltered, Kamiya Jani Curly Tales, Sandeep Maheshwari, Ankur Warikoo Podcast, Joe Rogan Experience, Steven Bartlett Diary of a CEO, Lex Fridman Podcast, Jay Shetty On Purpose. For each guest include: category (Bollywood/Cricket/Business/Politics/Tech/Sports/Entertainment), one line why they were interesting for that show, rajFit (true if suitable for Figuring Out With Raj Shamani), rajAngle (specific angle Raj should take if fit). Return ONLY valid JSON array of exactly 10 objects each with: host (string), guests (array of 3 objects each with name, category, why, rajFit, rajAngle). ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/\`\`\`json|\`\`\`/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const merged = COMPETITORS.map(comp => {
        const aiData = Array.isArray(parsed) ? parsed.find(p => p.host && p.host.toLowerCase().includes(comp.name.split(" ")[0].toLowerCase())) : null
        return { ...comp, guests: aiData ? aiData.guests : [] }
      })
      setCompetitors(merged)
    } catch (e) { alert("Error fetching competitor data: " + e.message) }
    setLoadingCompetitors(false)
  }

  useEffect(() => {
    const saved = localStorage.getItem("raj_guests")
    const date = localStorage.getItem("raj_last_updated")
    const key = localStorage.getItem("raj_api_key")
    const lastDate = localStorage.getItem("raj_last_date")
    const savedPipeline = localStorage.getItem("raj_pipeline")
    const savedNotes = localStorage.getItem("raj_notes")
    const today = new Date().toLocaleDateString('en-IN')
    if (key) { setApiKey(key); setShowApiInput(false) }
    if (date) setLastUpdated(date)
    if (savedPipeline) setPipeline(JSON.parse(savedPipeline))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    const savedHistory = localStorage.getItem("raj_guest_history")
    if (savedHistory) setGuestHistory(JSON.parse(savedHistory))
    if (saved) {
      setGuests(JSON.parse(saved))
      if (lastDate !== today && key) {
        localStorage.setItem("raj_last_date", today)
        setTimeout(() => generateGuests(key), 1500)
      }
    } else { localStorage.setItem("raj_last_date", today) }
  }, [])

  const saveApiKey = (key) => { setApiKey(key); localStorage.setItem("raj_api_key", key) }

  const addToPipeline = (guest, from = "category") => {
    if (pipeline.find(p => p.name === guest.name)) { alert(`${guest.name} is already in pipeline!`); return }
    const updated = [...pipeline, { ...guest, addedFrom: from, pipelineDate: new Date().toLocaleDateString('en-IN'), recordingDate: "" }]
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
    alert(`${guest.name} added to Pipeline!`)
  }

  const removeFromPipeline = (index) => {
    if (!window.confirm("Remove this guest from pipeline?")) return
    const updated = pipeline.filter((_, i) => i !== index)
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
  }

  const updatePipelineStatus = (index, status) => {
    const updated = [...pipeline]; updated[index].status = status
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
  }

  const updateRecordingDate = (index, date) => {
    const updated = [...pipeline]; updated[index].recordingDate = date
    setPipeline(updated); localStorage.setItem("raj_pipeline", JSON.stringify(updated))
  }

  const saveNote = (guestName) => {
    const updated = { ...notes, [guestName]: [...(notes[guestName] || []), { text: noteText, date: new Date().toLocaleString('en-IN') }] }
    setNotes(updated); localStorage.setItem("raj_notes", JSON.stringify(updated))
    setNoteText(""); setEditingNote(null)
  }

  // EXPORT TO CSV (Excel compatible)
  const exportToCSV = (data, filename) => {
    const headers = ["Name", "Category", "Score", "Priority", "Virality", "Relevance", "Value", "Status", "Why Now", "Topic Angle", "First Time"]
    const rows = data.map(g => [
      g.name, g.category, g.total, g.priority, g.virality, g.relevance, g.value,
      g.status || "New", (g.whyNow || "").replace(/,/g, ";"), (g.topicAngle || "").replace(/,/g, ";"),
      g.lastAppeared === "Never" ? "Yes" : "No"
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportGuestsToCSV = () => exportToCSV(guests, `raj-guests-${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`)
  const exportPipelineToCSV = () => exportToCSV(pipeline, `raj-pipeline-${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`)

  // EPISODE TITLE SUGGESTER
  const generateTitles = async (guest) => {
    if (!apiKey) return
    setLoadingTitles(true)
    setTitleGuest(guest)
    setTitles([])
    setShowTitles(true)
    try {
      const text = await callOpenAI(`You are a viral YouTube/podcast title expert for "Figuring Out With Raj Shamani".
Guest: ${guest.name} (${guest.category})
Topic Angle: ${guest.topicAngle}
Why Now: ${guest.whyNow}
Audience: Young Indians 18-35

Generate 5 different viral episode title options. Each title should:
- Be curiosity-driven and emotional
- Under 70 characters
- Work for YouTube, Spotify and Instagram
- Mix different styles: question, bold statement, controversy, story, number-based

Return ONLY valid JSON array of 5 strings. Each string is one title. NO MARKDOWN.`)
      const cleaned = text.replace(/\`\`\`json|\`\`\`/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setTitles(Array.isArray(parsed) ? parsed : [])
    } catch (e) { alert("Error: " + e.message) }
    setLoadingTitles(false)
  }

  // PRE-INTERVIEW BRIEF GENERATOR
  const generateBrief = async (guest) => {
    if (!apiKey) return
    setLoadingBrief(true)
    setBriefGuest(guest)
    setBrief("")
    setShowBrief(true)
    try {
      const text = await callOpenAI(`Generate a one-page Pre-Interview Brief for Raj Shamani before interviewing ${guest.name} (${guest.category}).

Include:
1. GUEST SNAPSHOT (3 lines — who they are, what they are known for, current status)
2. COMMUNICATION STYLE (how they speak, what style works best with them)
3. TOPICS THEY LOVE TALKING ABOUT (3-4 topics they always engage deeply on)
4. SENSITIVE TOPICS TO AVOID (things that make them defensive or uncomfortable)
5. BEST CONVERSATION OPENERS (2-3 specific openers that will get them talking immediately)
6. VIRAL MOMENT TRIGGERS (what kind of questions/topics tend to create emotional/viral moments with this guest)
7. DO's AND DON'Ts (5 quick bullets each)
8. ENERGY LEVEL (are they high energy, calm, intellectual, emotional — how to match them)

Be specific to ${guest.name}. Not generic. Factual and practical.`)
      setBrief(text)
    } catch (e) { alert("Error: " + e.message) }
    setLoadingBrief(false)
  }

  // AUDIENCE ALIGNMENT SCORE
  const generateAlignment = async (guest) => {
    if (!apiKey) return
    setLoadingAlignment(guest.name)
    try {
      const text = await callOpenAI(`Analyse audience alignment between "${guest.name}" (${guest.category}) and "Figuring Out With Raj Shamani".
Raj's audience: Young Indians 18-35, interested in growth, business, real stories, truth.

Score each factor from 1-10:
1. Age Group Match (does guest appeal to 18-35 age group?)
2. Interest Match (does guest's content match growth/business/truth themes?)
3. Aspirational Value (do young Indians look up to this person?)
4. Controversy Quotient (will this create buzz without being too risky?)
5. Shareability (will young Indians share this episode?)

Also give:
- Overall Alignment Score (average of 5)
- One line: Why this guest FITS or DOESN'T FIT Raj's audience
- Recommendation: BOOK NOW / CONSIDER / SKIP

Return ONLY valid JSON:
{ "ageMatch": 1-10, "interestMatch": 1-10, "aspirational": 1-10, "controversy": 1-10, "shareability": 1-10, "overall": 1-10, "verdict": "one line", "recommendation": "BOOK NOW or CONSIDER or SKIP" }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/\`\`\`json|\`\`\`/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setAlignmentData(prev => ({ ...prev, [guest.name]: parsed }))
    } catch (e) { alert("Error: " + e.message) }
    setLoadingAlignment(null)
  }

  // GLOBAL SEARCH — full guest profile
  const runGlobalSearch = async () => {
    if (!globalSearch.trim()) return
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoadingGlobalSearch(true)
    setGlobalSearchResult(null)
    // Check if guest is in past guests list
    const inPastGuests = PAST_GUESTS.toLowerCase().includes(globalSearch.toLowerCase())
    // Check if in pipeline
    const inPipeline = pipeline.find(g => g.name.toLowerCase().includes(globalSearch.toLowerCase()))
    // Check if in today's guests
    const inToday = guests.find(g => g.name.toLowerCase().includes(globalSearch.toLowerCase()))
    // Check recent history
    const recentGuests = JSON.parse(localStorage.getItem("raj_recent_guests") || "[]")
    const inRecent = recentGuests.find(n => n.toLowerCase().includes(globalSearch.toLowerCase()))
    try {
      const text = await callOpenAI(`You are a research analyst. Provide a complete profile for: "${globalSearch}"
Return ONLY valid JSON with these exact keys:
{
  "fullName": "complete name",
  "age": "age or approximate",
  "category": "their primary category",
  "tagline": "one line who they are",
  "background": "2-3 lines background and career journey",
  "achievements": ["achievement 1", "achievement 2", "achievement 3", "achievement 4"],
  "currentStatus": "what are they doing right now in 2024-2025",
  "socialFollowing": "Instagram/YouTube/Twitter following approximately",
  "netWorth": "approximate net worth or revenue if known",
  "whyNowForRaj": "why this specific person should be on Figuring Out right now",
  "bestAngle": "the single best conversation angle for Raj Shamani's show",
  "audienceMatch": 1-10,
  "controversies": "any known controversies - truth based only",
  "audienceDemographics": "who follows them - age group and interests",
  "viralPotential": 1-10,
  "recommendation": "BOOK NOW or CONSIDER or SKIP",
  "recommendationReason": "one line why"
}
ONLY valid JSON. NO MARKDOWN. Be factual and specific.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setGlobalSearchResult({
        ...parsed,
        inPastGuests,
        inPipeline: inPipeline || null,
        inToday: inToday || null,
        inRecent: !!inRecent,
        searchedName: globalSearch
      })
    } catch (e) { alert("Error: " + e.message) }
    setLoadingGlobalSearch(false)
  }

  const replaceGuest = async (index) => {
    if (!apiKey) return
    setReplacingIndex(index)
    const existingNames = guests.map(g => g.name).join(", ")
    const recentGuests = JSON.parse(localStorage.getItem("raj_recent_guests") || "[]")
    try {
      const text = await callOpenAI(`Suggest 1 fresh podcast guest for "Figuring Out With Raj Shamani".
Avoid: ${PAST_GUESTS}, ${existingNames}, ${recentGuests.join(", ")}
Priority: Virat Kohli, Rohit Sharma, Deepika Padukone, Shah Rukh Khan, Rahul Gandhi, Sundar Pichai, PV Sindhu, Neeraj Chopra
Return JSON: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared, repeatReason, isAISlot(false)
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      const newGuest = { ...parsed, total: ((parsed.virality + parsed.relevance + parsed.value) / 3).toFixed(1), priority: ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 8 ? "High" : ((parsed.virality + parsed.relevance + parsed.value) / 3) >= 6 ? "Medium" : "Low", status: "New", addedDate: new Date().toLocaleDateString('en-IN') }
      const updated = [...guests]; updated[index] = newGuest
      setGuests(updated); localStorage.setItem("raj_guests", JSON.stringify(updated))
    } catch (e) { alert("Error: " + e.message) }
    setReplacingIndex(null)
  }

  const generateResearch = async (guest) => {
    if (!apiKey) return
    setLoading(true); setSelectedGuest(guest); setView("research")
    try {
      const text = await callOpenAI(`Detailed research card for: ${guest.name} (${guest.category})
1. SHORT BIO (3-4 lines)
2. THEIR STORY (journey, struggles, rise)
3. KEY ACHIEVEMENTS (bullet points)
4. CURRENT CONTROVERSIES (truth-based, no rumours)
5. UNIQUE ANGLE for Raj Shamani's show
6. WHY THIS GUEST NOW
Factual, honest, insightful.`)
      setResearch(text)
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  const generateQuestions = async (guest) => {
    if (!apiKey) return
    setLoading(true); setSelectedGuest(guest); setView("questions")
    try {
      const text = await callOpenAI(`20 powerful interview questions for Raj Shamani's podcast: ${guest.name} (${guest.category})
Style: Raw, honest, value-driven. Audience: young Indians 18-35.
- 3 HOOK QUESTIONS
- 5 STORY QUESTIONS
- 5 DEEP VALUE QUESTIONS
- 4 CONTROVERSIAL BUT FAIR QUESTIONS (truth-based, NO rumours)
- 3 VIRAL CLIP QUESTIONS
Specific to ${guest.name}, not generic.`)
      setQuestions(text)
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  const generateOutreach = async (guest) => {
    if (!apiKey) return
    setLoading(true); setSelectedGuest(guest); setView("outreach")
    setOutreach({ subject: "", body: "", recipientEmail: "" })
    try {
      const text = await callOpenAI(`Professional outreach email from Raj Shamani's team to ${guest.name} (${guest.category}).
Show: India's top podcast, 500+ episodes, young Indians 18-35.
- Warm but professional, why ${guest.name} specifically and why NOW
- Ask: "What value will you add and how will it benefit viewers?"
- Clear call to action, under 200 words
Return ONLY valid JSON: { "subject": "email subject", "body": "email body with \\n for line breaks" }
ONLY valid JSON. NO markdown. NO backticks.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      const parsed = JSON.parse(cleaned)
      setOutreach({ subject: parsed.subject || "", body: parsed.body || "", recipientEmail: "" })
    } catch (e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  // ─── WHATSAPP MESSAGE GENERATOR ───
  const generateWhatsapp = async (guest) => {
    if (!apiKey) return
    setLoadingWhatsapp(true)
    setWhatsappMsg("")
    try {
      const text = await callOpenAI(`Write a casual, friendly WhatsApp message from Raj Shamani's team to ${guest.name} (${guest.category}) inviting them on the podcast.
Show: Figuring Out With Raj Shamani — India's top podcast, 500+ episodes.
Rules:
- Very casual and warm tone, like a real WhatsApp message
- Short — max 100 words
- Mention why ${guest.name} specifically
- No formal subject line needed
- End with a simple question to start conversation
- Use emojis naturally (2-3 max)
Return ONLY the WhatsApp message text. No JSON. No labels. Just the message.`)
      setWhatsappMsg(text.trim())
    } catch (e) { alert("Error: " + e.message) }
    setLoadingWhatsapp(false)
  }

  const openInGmail = () => {
    window.open(`mailto:${outreach.recipientEmail || ""}?subject=${encodeURIComponent(outreach.subject)}&body=${encodeURIComponent(outreach.body)}`, "_blank")
  }

  const openInWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, "_blank")
  }

  const copyEmailBody = () => {
    navigator.clipboard.writeText(`Subject: ${outreach.subject}\n\n${outreach.body}`)
    setCopiedEmail(true); setTimeout(() => setCopiedEmail(false), 2000)
  }

  const copyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMsg)
    setCopiedWA(true); setTimeout(() => setCopiedWA(false), 2000)
  }

  const toggleCompare = (guest) => {
    const exists = comparedGuests.find(g => g.name === guest.name)
    if (exists) { setComparedGuests(comparedGuests.filter(g => g.name !== guest.name)) }
    else {
      if (comparedGuests.length >= 3) { alert("Max 3 guests allowed for comparison!"); return }
      setComparedGuests([...comparedGuests, guest])
    }
  }

  const priorityColor = (p) => p === "High" ? "#00ff88" : p === "Medium" ? "#ffaa00" : "#ff6666"
  const statusColor = (s) => s === "Booked" ? "#00ff88" : s === "Contacted" ? "#ffaa00" : s === "Declined" ? "#ff6666" : "#666"
  const filteredDisplayGuests = (activeCategory === "all" ? guests : categoryGuests).filter(g => {
    const matchSearch = !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPriority = filterPriority === "All" || g.priority === filterPriority
    const matchStatus = filterStatus === "All" || g.status === filterStatus
    return matchSearch && matchPriority && matchStatus
  })
  const displayGuests = filteredDisplayGuests

  const filteredPipeline = pipeline
    .filter(g => pipelineFilter === "All" || g.status === pipelineFilter)
    .sort((a, b) => pipelineSort === "score" ? b.total - a.total : pipelineSort === "date" ? new Date(b.pipelineDate) - new Date(a.pipelineDate) : a.name.localeCompare(b.name))

  // ─── ACTION BUTTONS ROW (reusable) ───
  const ActionButtons = ({ g, compact = false }) => {
    const p = compact ? "5px 6px" : "8px"
    const fs = compact ? "11px" : "12px"
    return (
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
        <button onClick={() => generateResearch(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: fs, minWidth: compact ? "auto" : "0" }}>{compact ? "📋" : "📋 Research"}</button>
        <button onClick={() => generateOutreach(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: fs }}>{compact ? "✉️" : "✉️ Outreach"}</button>
        <button onClick={() => generateQuestions(g)} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: fs }}>{compact ? "❓" : "❓ Questions"}</button>
        <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ flex: 1, padding: p, borderRadius: "7px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: fs }}>{compact ? "💬" : "💬 WhatsApp"}</button>
      </div>
    )
  }

  const GuestCard = ({ g, i, source = "main", showAddToPipeline = false }) => {
    const isCompared = !!comparedGuests.find(c => c.name === g.name)
    return (
      <div style={{ background: g.isAISlot ? "linear-gradient(135deg,#1a0a2e,#0d1a3c)" : "#111827", borderRadius: "12px", padding: isMobile ? "14px" : "20px", border: `1px solid ${isCompared ? "#7c3aed" : g.isAISlot ? "#7c3aed" : priorityColor(g.priority) + "33"}`, opacity: replacingIndex === i ? 0.5 : 1, transition: "all 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? "15px" : "16px" }}>{replacingIndex === i ? "Finding..." : g.name}</h3>
              {g.isAISlot && <span style={{ fontSize: "10px", background: "#7c3aed", color: "#fff", padding: "2px 7px", borderRadius: "10px" }}>AI Expert</span>}
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
              {g.lastAppeared === "Never" || g.lastAppeared === "First appearance"
                ? <span style={{ fontSize: "11px", color: "#00ff88" }}>First Time</span>
                : <span style={{ fontSize: "11px", color: "#f59e0b" }}>Repeat ({g.lastAppeared})</span>}
            </div>
          </div>
          <div style={{ textAlign: "right", marginLeft: "10px" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
            <div style={{ fontSize: "11px", color: priorityColor(g.priority), fontWeight: "bold" }}>{g.priority}</div>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 6px", lineHeight: "1.5" }}><span style={{ color: "#f59e0b" }}>Why Now:</span> {g.whyNow}</p>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px", lineHeight: "1.5" }}><span style={{ color: "#60a5fa" }}>Angle:</span> {g.topicAngle}</p>
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Virality {g.virality}</span>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Relevance {g.relevance}</span>
          <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 10px", borderRadius: "6px" }}>Value {g.value}</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <select value={g.status}
            onChange={e => {
              if (source === "main") {
                const u = [...guests]; u[i].status = e.target.value
                setGuests(u); localStorage.setItem("raj_guests", JSON.stringify(u))
              }
            }}
            style={{ width: "100%", padding: "7px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px", cursor: "pointer" }}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Booked">Booked</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
        <div style={{ marginBottom: "8px" }}><ActionButtons g={g} /></div>
        {/* Audience Alignment Score */}
        {alignmentData[g.name] ? (
          <div style={{ marginBottom: "8px", background: "#0d1117", borderRadius: "8px", padding: "10px 12px", border: `1px solid ${alignmentData[g.name].overall >= 8 ? "#166534" : alignmentData[g.name].overall >= 6 ? "#92400e" : "#7f1d1d"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold" }}>AUDIENCE ALIGNMENT</span>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: alignmentData[g.name].overall >= 8 ? "#00ff88" : alignmentData[g.name].overall >= 6 ? "#ffaa00" : "#ff6666" }}>{alignmentData[g.name].overall}/10</span>
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>{alignmentData[g.name].verdict}</div>
            <span style={{ fontSize: "11px", fontWeight: "bold", padding: "2px 8px", borderRadius: "6px", background: alignmentData[g.name].recommendation === "BOOK NOW" ? "#14532d" : alignmentData[g.name].recommendation === "CONSIDER" ? "#78350f" : "#7f1d1d", color: alignmentData[g.name].recommendation === "BOOK NOW" ? "#4ade80" : alignmentData[g.name].recommendation === "CONSIDER" ? "#fbbf24" : "#f87171" }}>
              {alignmentData[g.name].recommendation}
            </span>
          </div>
        ) : (
          <button onClick={() => generateAlignment(g)} disabled={loadingAlignment === g.name}
            style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#0d1117", color: "#60a5fa", border: "1px solid #1e3a5f", cursor: loadingAlignment === g.name ? "not-allowed" : "pointer", fontSize: "12px" }}>
            {loadingAlignment === g.name ? "⏳ Analysing..." : "🎯 Audience Alignment Score"}
          </button>
        )}
        {/* Title Suggester Button */}
        <button onClick={() => generateTitles(g)}
          style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#1a0a2e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
          🎬 Suggest Episode Titles
        </button>
        {/* Pre-Interview Brief Button */}
        <button onClick={() => generateBrief(g)}
          style={{ width: "100%", marginBottom: "8px", padding: "7px", borderRadius: "8px", background: "#1a1a0a", color: "#fbbf24", border: "1px solid #92400e", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
          📄 Pre-Interview Brief
        </button>
        {showAddToPipeline && <button onClick={() => addToPipeline(g, "category")} style={{ width: "100%", marginBottom: "6px", padding: "8px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Add to Pipeline</button>}
        {source === "main" && <button onClick={() => addToPipeline(g, "daily")} style={{ width: "100%", marginBottom: "6px", padding: "7px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px" }}>Add to Pipeline</button>}
        {!g.isAISlot && source === "main" && <button onClick={() => replaceGuest(i)} disabled={replacingIndex === i} style={{ width: "100%", marginBottom: "6px", padding: "7px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: replacingIndex === i ? "not-allowed" : "pointer", fontSize: "12px" }}>{replacingIndex === i ? "Finding..." : "Replace This Guest"}</button>}
        <button onClick={() => toggleCompare(g)} style={{ width: "100%", padding: "7px", borderRadius: "8px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: `1px solid ${isCompared ? "#166534" : "#4c1d95"}`, cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
          {isCompared ? "Added to Compare" : "Compare"}
        </button>
      </div>
    )
  }

  const heatColor = (h) => h >= 8 ? "#ff4444" : h >= 6 ? "#ff8800" : "#ffcc00"

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1a0533,#0d1f3c)", padding: isMobile ? "14px 16px" : "20px 30px", borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? "17px" : "22px", background: "linear-gradient(90deg,#a855f7,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🎙️ Figuring Out — Guest Intelligence</h1>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#888" }}>AI-Powered • 500+ Guests Tracked {lastUpdated && `• Updated: ${lastUpdated}`}</p>
          </div>
          {!isMobile && showApiInput && <input placeholder="Enter OpenAI API Key" value={apiKey} onChange={e => saveApiKey(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "#fff", fontSize: "13px", width: "220px" }} />}
        </div>
        {isMobile && showApiInput && <input placeholder="Enter OpenAI API Key" value={apiKey} onChange={e => saveApiKey(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #444", background: "#1a1a2e", color: "#fff", fontSize: "13px", marginBottom: "10px", boxSizing: "border-box" }} />}
        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setShowApiInput(!showApiInput)} style={{ padding: "7px 10px", borderRadius: "8px", background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: "11px" }}>{showApiInput ? "Hide Key" : "API Key"}</button>
          <button onClick={() => { setView("home"); setActiveCategory("all"); setCategoryGuests([]) }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "home" ? "#2e1e5f" : "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🏠 Home</button>
          <button onClick={() => setView("pipeline")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "pipeline" ? "#164e63" : "#1e1e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📋 {pipeline.length > 0 ? `Pipeline (${pipeline.length})` : "Pipeline"}</button>
          <button onClick={() => setView("planner")} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "planner" ? "#14532d" : "#1e1e3f", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📅 Planner</button>
          <button onClick={() => { setView("trending"); if (trends.length === 0) fetchTrends() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "trending" ? "#7c2d12" : "#1e1e3f", color: "#fb923c", border: "1px solid #9a3412", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🔥 Trending</button>
          <button onClick={() => { setView("competitors"); if (competitors.length === 0) fetchCompetitors() }} style={{ padding: "7px 12px", borderRadius: "8px", background: view === "competitors" ? "#1e1b4b" : "#1e1e3f", color: "#818cf8", border: "1px solid #3730a3", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>🏆 Competitors</button>
          <button onClick={() => setHistoryView(!historyView)} style={{ padding: "7px 12px", borderRadius: "8px", background: historyView ? "#1a1a2e" : "#1e1e3f", color: "#f59e0b", border: "1px solid #92400e", cursor: "pointer", fontSize: isMobile ? "12px" : "13px" }}>📜 History</button>
          {comparedGuests.length >= 2 && <button onClick={() => setView("compare")} style={{ padding: "7px 12px", borderRadius: "8px", background: "linear-gradient(135deg,#4c1d95,#1e3a5f)", color: "#c4b5fd", border: "1px solid #7c3aed", cursor: "pointer", fontSize: isMobile ? "12px" : "13px", fontWeight: "bold" }}>⚖️ Compare ({comparedGuests.length})</button>}
          <button onClick={() => generateGuests()} disabled={loading} style={{ padding: "8px 14px", borderRadius: "8px", background: loading ? "#333" : "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: isMobile ? "12px" : "13px", fontWeight: "bold" }}>{loading ? "⏳ Loading..." : "🔄 Refresh"}</button>
        </div>
      </div>

      {/* Category Bar */}
      {view === "home" && (
        <div style={{ background: "#0d0d1a", borderBottom: "1px solid #222", padding: "10px 16px", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "6px", minWidth: "max-content" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => generateCategoryGuests(cat)}
                style={{ padding: "7px 14px", borderRadius: "20px", border: `1px solid ${activeCategory === cat.id ? cat.color : "#333"}`, background: activeCategory === cat.id ? cat.color + "22" : "#111", color: activeCategory === cat.id ? cat.color : "#888", cursor: "pointer", fontSize: "12px", fontWeight: activeCategory === cat.id ? "bold" : "normal", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: isMobile ? "14px" : "24px", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Global Search Bar */}
        <div style={{ background: "#080810", borderBottom: "1px solid #1f2937", padding: "10px 24px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", gap: "8px", alignItems: "center", background: "#111827", borderRadius: "10px", padding: "8px 14px", border: "1px solid #374151" }}>
            <span style={{ fontSize: "15px" }}>🔍</span>
            <input
              placeholder="Global Search — type any name for full profile + history check..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runGlobalSearch()}
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "13px", outline: "none" }}
            />
            {globalSearch && <span onClick={() => { setGlobalSearch(""); setGlobalSearchResult(null) }} style={{ cursor: "pointer", color: "#6b7280", fontSize: "18px" }}>×</span>}
          </div>
          <button onClick={runGlobalSearch} disabled={loadingGlobalSearch || !globalSearch.trim()}
            style={{ padding: "8px 18px", borderRadius: "10px", background: globalSearch.trim() ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#1f2937", color: globalSearch.trim() ? "#fff" : "#4b5563", border: "none", cursor: globalSearch.trim() ? "pointer" : "not-allowed", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" }}>
            {loadingGlobalSearch ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Global Search Result */}
        {globalSearchResult && (
          <div style={{ background: "#0d0d1a", borderBottom: "1px solid #1f2937", padding: "20px 24px" }}>
            <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
              {/* Status Badges */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>{globalSearchResult.fullName}</h3>
                <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 10px", borderRadius: "20px" }}>{globalSearchResult.category}</span>
                {globalSearchResult.inPastGuests && <span style={{ fontSize: "11px", background: "#14532d", color: "#4ade80", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>✅ Already on Show</span>}
                {!globalSearchResult.inPastGuests && <span style={{ fontSize: "11px", background: "#1e3a5f", color: "#60a5fa", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>✨ Never on Show</span>}
                {globalSearchResult.inPipeline && <span style={{ fontSize: "11px", background: "#78350f", color: "#fbbf24", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>📋 In Pipeline — {globalSearchResult.inPipeline.status}</span>}
                {globalSearchResult.inRecent && !globalSearchResult.inPipeline && <span style={{ fontSize: "11px", background: "#2a1a1a", color: "#f87171", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" }}>⏳ Suggested Recently</span>}
                <span style={{ fontSize: "11px", fontWeight: "bold", padding: "2px 10px", borderRadius: "20px", background: globalSearchResult.recommendation === "BOOK NOW" ? "#14532d" : globalSearchResult.recommendation === "CONSIDER" ? "#78350f" : "#7f1d1d", color: globalSearchResult.recommendation === "BOOK NOW" ? "#4ade80" : globalSearchResult.recommendation === "CONSIDER" ? "#fbbf24" : "#f87171" }}>
                  {globalSearchResult.recommendation}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
                {/* Profile */}
                <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #1f2937" }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>Profile</div>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#d1d5db", lineHeight: "1.6" }}>{globalSearchResult.background}</p>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Age: {globalSearchResult.age}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Following: {globalSearchResult.socialFollowing}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Net Worth: {globalSearchResult.netWorth}</div>
                </div>

                {/* For Raj's Show */}
                <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #166534" }}>
                  <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>For Raj's Show</div>
                  <div style={{ fontSize: "12px", color: "#f59e0b", marginBottom: "4px" }}>Why Now:</div>
                  <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#d1d5db", lineHeight: "1.5" }}>{globalSearchResult.whyNowForRaj}</p>
                  <div style={{ fontSize: "12px", color: "#60a5fa", marginBottom: "4px" }}>Best Angle:</div>
                  <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#d1d5db", lineHeight: "1.5" }}>{globalSearchResult.bestAngle}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px", color: globalSearchResult.audienceMatch >= 8 ? "#00ff88" : globalSearchResult.audienceMatch >= 6 ? "#ffaa00" : "#ff6666" }}>Audience: {globalSearchResult.audienceMatch}/10</span>
                    <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px", color: globalSearchResult.viralPotential >= 8 ? "#00ff88" : globalSearchResult.viralPotential >= 6 ? "#ffaa00" : "#ff6666" }}>Viral: {globalSearchResult.viralPotential}/10</span>
                  </div>
                </div>

                {/* Achievements */}
                <div style={{ background: "#111827", borderRadius: "10px", padding: "14px", border: "1px solid #1f2937" }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>Key Achievements</div>
                  {globalSearchResult.achievements && globalSearchResult.achievements.map((a, ai) => (
                    <div key={ai} style={{ fontSize: "12px", color: "#d1d5db", padding: "3px 0", borderBottom: "1px solid #1f2937", display: "flex", gap: "6px" }}>
                      <span style={{ color: "#4ade80" }}>▸</span> {a}
                    </div>
                  ))}
                  {globalSearchResult.controversies && globalSearchResult.controversies !== "None" && (
                    <div style={{ marginTop: "8px", padding: "6px 8px", background: "#2a1a1a", borderRadius: "6px", fontSize: "11px", color: "#f87171" }}>
                      ⚠️ {globalSearchResult.controversies}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => addToPipeline({ name: globalSearchResult.fullName, category: globalSearchResult.category, whyNow: globalSearchResult.whyNowForRaj, topicAngle: globalSearchResult.bestAngle, virality: globalSearchResult.viralPotential, relevance: globalSearchResult.audienceMatch, value: 8, total: ((globalSearchResult.viralPotential + globalSearchResult.audienceMatch + 8) / 3).toFixed(1), priority: ((globalSearchResult.viralPotential + globalSearchResult.audienceMatch + 8) / 3) >= 8 ? "High" : "Medium", status: "New", lastAppeared: globalSearchResult.inPastGuests ? "Previously" : "Never", isAISlot: false, addedDate: new Date().toLocaleDateString("en-IN") }, "search")}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                  + Add to Pipeline
                </button>
                <button onClick={() => generateResearch({ name: globalSearchResult.fullName, category: globalSearchResult.category })}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>
                  📋 Research
                </button>
                <button onClick={() => generateOutreach({ name: globalSearchResult.fullName, category: globalSearchResult.category, whyNow: globalSearchResult.whyNowForRaj, topicAngle: globalSearchResult.bestAngle })}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px" }}>
                  ✉️ Outreach
                </button>
                <button onClick={() => generateQuestions({ name: globalSearchResult.fullName, category: globalSearchResult.category })}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "13px" }}>
                  ❓ Questions
                </button>
                <button onClick={() => { setSelectedGuest({ name: globalSearchResult.fullName, category: globalSearchResult.category }); generateWhatsapp({ name: globalSearchResult.fullName, category: globalSearchResult.category }); setView("whatsapp") }}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "13px" }}>
                  💬 WhatsApp
                </button>
                <button onClick={() => generateBrief({ name: globalSearchResult.fullName, category: globalSearchResult.category })}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a1a0a", color: "#fbbf24", border: "1px solid #92400e", cursor: "pointer", fontSize: "13px" }}>
                  📄 Brief
                </button>
                <button onClick={() => setGlobalSearchResult(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar - Priority, Status, Export */}
      {view === "home" && guests.length > 0 && (
        <div style={{ background: "#0d0d1a", borderBottom: "1px solid #1f2937", padding: "8px 24px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", background: "#1f2937", color: filterPriority === "High" ? "#00ff88" : filterPriority === "Medium" ? "#ffaa00" : filterPriority === "Low" ? "#ff6666" : "#9ca3af", border: "1px solid #374151", fontSize: "12px", cursor: "pointer" }}>
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", fontSize: "12px", cursor: "pointer" }}>
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Booked">Booked</option>
            <option value="Declined">Declined</option>
          </select>
          {(filterPriority !== "All" || filterStatus !== "All") && (
            <button onClick={() => { setFilterPriority("All"); setFilterStatus("All") }}
              style={{ padding: "7px 12px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "12px" }}>
              Clear
            </button>
          )}
          <button onClick={exportGuestsToCSV} style={{ padding: "7px 14px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "12px", fontWeight: "bold", marginLeft: "auto" }}>
            Export CSV
          </button>
        </div>
      )}

      {/* Home View */}
        {view === "home" && (
          <div>
            {guests.length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", color: "#a78bfa", fontSize: isMobile ? "16px" : "20px" }}>{activeCategory === "all" ? "Today's Guest Recommendations" : `${CATEGORIES.find(c => c.id === activeCategory)?.label} — Top 5`}</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#666", flexWrap: "wrap" }}>
                  <span>🟢 {guests.filter(g => g.priority === "High").length} High</span>
                  <span>🟡 {guests.filter(g => g.priority === "Medium").length} Medium</span>
                  {pipeline.length > 0 && <span style={{ color: "#38bdf8" }}>📋 {pipeline.length} Pipeline</span>}
                </div>
              </div>
            )}
            {loadingCategory && <div style={{ textAlign: "center", padding: "60px", color: "#666", fontSize: "16px" }}>Finding best guests in this category...</div>}
            {!loadingCategory && guests.length === 0 && activeCategory === "all" && (
              <div style={{ textAlign: "center", padding: isMobile ? "40px 16px" : "80px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎯</div>
                <h2 style={{ fontSize: isMobile ? "20px" : "24px", color: "#a78bfa" }}>Welcome to Guest Intelligence System</h2>
                <p style={{ color: "#666", marginBottom: "8px", fontSize: "14px" }}>500+ past guests tracked • 15 fresh daily suggestions</p>
                <p style={{ color: "#555", marginBottom: "30px", fontSize: "12px" }}>Priority: Virat Kohli • Rohit Sharma • Deepika • SRK • Sachin • Rahul Gandhi</p>
                <button onClick={() => generateGuests()} style={{ padding: "14px 32px", borderRadius: "12px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>🚀 Generate Guest List</button>
              </div>
            )}
            {!loadingCategory && displayGuests.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(340px,1fr))", gap: "14px" }}>
                {displayGuests.map((g, i) => <GuestCard key={i} g={g} i={i} source={activeCategory === "all" ? "main" : "category"} showAddToPipeline={activeCategory !== "all"} />)}
              </div>
            )}
          </div>
        )}

        {/* Trending Topics View */}
        {view === "trending" && (
          <div>
            <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#fb923c" }}>🔥 Trending Topics Dashboard</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>What's trending in India today — AI suggests the perfect guest for each trend</p>
              </div>
              <button onClick={fetchTrends} disabled={loadingTrends} style={{ padding: "10px 20px", borderRadius: "8px", background: loadingTrends ? "#333" : "linear-gradient(135deg,#9a3412,#7c2d12)", color: "#fb923c", border: "1px solid #9a3412", cursor: loadingTrends ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "bold" }}>
                {loadingTrends ? "⏳ Fetching Trends..." : "🔄 Refresh Trends"}
              </button>
            </div>

            {loadingTrends && (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>📡</div>
                <p>Analyzing what's trending in India today...</p>
              </div>
            )}

            {!loadingTrends && trends.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "50px", marginBottom: "16px" }}>🔥</div>
                <h3 style={{ color: "#555" }}>No trends loaded yet</h3>
                <p style={{ color: "#444", fontSize: "13px" }}>Click "Refresh Trends" to see what's trending in India today</p>
                <button onClick={fetchTrends} style={{ marginTop: "16px", padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg,#9a3412,#7c2d12)", color: "#fb923c", border: "none", cursor: "pointer" }}>🔥 Load Trends</button>
              </div>
            )}

            {trends.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(420px,1fr))", gap: "16px" }}>
                {trends.map((trend, ti) => (
                  <div key={ti} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${heatColor(trend.heat)}33`, overflow: "hidden" }}>
                    {/* Trend Header */}
                    <div style={{ padding: "16px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "18px", fontWeight: "bold", color: heatColor(trend.heat) }}>🔥 {trend.topic}</span>
                          <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{trend.category}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>{trend.headline}</p>
                      </div>
                      <div style={{ textAlign: "center", minWidth: "44px" }}>
                        <div style={{ fontSize: "20px", fontWeight: "bold", color: heatColor(trend.heat) }}>{trend.heat}</div>
                        <div style={{ fontSize: "10px", color: "#555" }}>heat</div>
                        {/* Heat bar */}
                        <div style={{ width: "40px", height: "4px", background: "#1f2937", borderRadius: "2px", marginTop: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${trend.heat * 10}%`, height: "100%", background: heatColor(trend.heat), borderRadius: "2px" }} />
                        </div>
                      </div>
                    </div>

                    {/* Guest Suggestion */}
                    <div style={{ padding: "16px" }}>
                      {!trendGuests[trend.topic] && loadingTrendGuest !== trend.topic && (
                        <button onClick={() => findGuestForTrend(trend)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg,#1a2e1a,#14532d)", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                          🎯 Find Perfect Guest for This Trend
                        </button>
                      )}
                      {loadingTrendGuest === trend.topic && (
                        <div style={{ textAlign: "center", padding: "16px", color: "#666", fontSize: "13px" }}>⏳ Finding the perfect guest...</div>
                      )}
                      {trendGuests[trend.topic] && (() => {
                        const g = trendGuests[trend.topic]
                        return (
                          <div style={{ background: "#0d1117", borderRadius: "8px", padding: "14px", border: `1px solid ${priorityColor(g.priority)}33` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                              <div>
                                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff", marginBottom: "4px" }}>{g.name}</div>
                                <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "22px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
                                <div style={{ fontSize: "10px", color: priorityColor(g.priority) }}>{g.priority}</div>
                              </div>
                            </div>
                            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px", lineHeight: "1.5" }}><span style={{ color: "#f59e0b" }}>Why:</span> {g.whyNow}</p>
                            <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 12px", lineHeight: "1.5" }}><span style={{ color: "#60a5fa" }}>Angle:</span> {g.topicAngle}</p>
                            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                              <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px" }}>V:{g.virality}</span>
                              <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px" }}>R:{g.relevance}</span>
                              <span style={{ fontSize: "11px", background: "#1f2937", padding: "3px 8px", borderRadius: "6px" }}>Val:{g.value}</span>
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <button onClick={() => addToPipeline(g, "trending")} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>+ Pipeline</button>
                              <button onClick={() => generateResearch(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "12px" }}>Research</button>
                              <button onClick={() => generateOutreach(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "12px" }}>Outreach</button>
                              <button onClick={() => toggleCompare(g)} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: comparedGuests.find(c => c.name === g.name) ? "#1a3a2a" : "#1a1a2e", color: comparedGuests.find(c => c.name === g.name) ? "#4ade80" : "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer", fontSize: "12px" }}>Compare</button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pipeline View */}
        {view === "pipeline" && (
          <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
              <h2 style={{ margin: "0 0 4px", color: "#38bdf8" }}>📋 Guest Pipeline — CRM</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Track, manage and follow up with all your podcast guests</p>
              </div>
              <button onClick={exportPipelineToCSV} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                📥 Export Pipeline CSV
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {["All", "New", "Contacted", "Booked", "Declined"].map(s => (
                <div key={s} onClick={() => setPipelineFilter(s)} style={{ padding: "10px 16px", borderRadius: "10px", background: pipelineFilter === s ? "#1e3a5f" : "#111827", border: `1px solid ${pipelineFilter === s ? "#3b82f6" : "#333"}`, cursor: "pointer", textAlign: "center", minWidth: "70px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: s === "Booked" ? "#00ff88" : s === "Contacted" ? "#ffaa00" : s === "Declined" ? "#ff6666" : s === "New" ? "#a78bfa" : "#38bdf8" }}>
                    {s === "All" ? pipeline.length : pipeline.filter(g => g.status === s).length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#666" }}>Sort:</span>
              {["score", "date", "name"].map(s => (
                <button key={s} onClick={() => setPipelineSort(s)} style={{ padding: "5px 12px", borderRadius: "6px", background: pipelineSort === s ? "#1e3a5f" : "#111", border: `1px solid ${pipelineSort === s ? "#3b82f6" : "#333"}`, color: pipelineSort === s ? "#60a5fa" : "#666", cursor: "pointer", fontSize: "12px" }}>
                  {s === "score" ? "Score" : s === "date" ? "Date" : "Name"}
                </button>
              ))}
            </div>
            {pipeline.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "50px", marginBottom: "16px" }}>📭</div>
                <h3 style={{ color: "#555" }}>Pipeline is empty</h3>
                <p style={{ color: "#444", fontSize: "13px" }}>Go to Home and click "Add to Pipeline" on any guest card</p>
                <button onClick={() => setView("home")} style={{ marginTop: "16px", padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer" }}>Go to Home</button>
              </div>
            ) : isMobile ? (
              // Mobile Pipeline — Card View
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPipeline.map((g, i) => {
                  const realIndex = pipeline.findIndex(p => p.name === g.name)
                  const isCompared = !!comparedGuests.find(c => c.name === g.name)
                  return (
                    <div key={i} style={{ background: isCompared ? "#1a1a2e" : "#111827", borderRadius: "10px", padding: "14px", border: `1px solid ${isCompared ? "#7c3aed" : "#1f2937"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff" }}>{g.name}</div>
                          <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "2px 8px", borderRadius: "20px" }}>{g.category}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "22px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div>
                          <div style={{ fontSize: "10px", color: priorityColor(g.priority) }}>{g.priority}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <select value={g.status} onChange={e => updatePipelineStatus(realIndex, e.target.value)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px" }}>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Booked">Booked</option>
                          <option value="Declined">Declined</option>
                        </select>
                        <input type="date" value={g.recordingDate || ""} onChange={e => updateRecordingDate(realIndex, e.target.value)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#1f2937", color: g.recordingDate ? "#00ff88" : "#666", border: "1px solid #333", fontSize: "12px" }} />
                      </div>
                      <ActionButtons g={g} compact />
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                        <button onClick={() => toggleCompare(g)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: "none", cursor: "pointer", fontSize: "11px" }}>{isCompared ? "Comparing" : "Compare"}</button>
                        <button onClick={() => removeFromPipeline(realIndex)} style={{ flex: 1, padding: "6px", borderRadius: "6px", background: "#2a1a1a", color: "#f87171", border: "none", cursor: "pointer", fontSize: "11px" }}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Desktop Pipeline — Table View
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#111827", borderBottom: "1px solid #333" }}>
                      {["Guest", "Category", "Score", "Priority", "Status", "Recording Date", "Notes", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: "600", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPipeline.map((g, i) => {
                      const realIndex = pipeline.findIndex(p => p.name === g.name)
                      const isCompared = !!comparedGuests.find(c => c.name === g.name)
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #1f2937", background: isCompared ? "#1a1a2e" : i % 2 === 0 ? "#0d0d1a" : "#0a0a0f" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#111827"}
                          onMouseLeave={e => e.currentTarget.style.background = isCompared ? "#1a1a2e" : i % 2 === 0 ? "#0d0d1a" : "#0a0a0f"}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: "bold", color: "#fff", marginBottom: "2px" }}>{g.name}</div>
                            <div style={{ fontSize: "11px", color: "#555" }}>Added: {g.pipelineDate}</div>
                            {g.lastAppeared === "Never" && <span style={{ fontSize: "10px", color: "#00ff88" }}>First Time</span>}
                          </td>
                          <td style={{ padding: "14px 16px" }}><span style={{ background: "#1e1e3f", color: "#a78bfa", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>{g.category}</span></td>
                          <td style={{ padding: "14px 16px" }}><div style={{ fontSize: "20px", fontWeight: "bold", color: priorityColor(g.priority) }}>{g.total}</div></td>
                          <td style={{ padding: "14px 16px" }}><span style={{ color: priorityColor(g.priority), fontWeight: "bold", fontSize: "12px" }}>{g.priority}</span></td>
                          <td style={{ padding: "14px 16px" }}>
                            <select value={g.status} onChange={e => updatePipelineStatus(realIndex, e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", background: "#1f2937", color: statusColor(g.status), border: `1px solid ${statusColor(g.status)}`, fontSize: "12px", cursor: "pointer" }}>
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Booked">Booked</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <input type="date" value={g.recordingDate || ""} onChange={e => updateRecordingDate(realIndex, e.target.value)} style={{ padding: "6px", borderRadius: "6px", background: "#1f2937", color: g.recordingDate ? "#00ff88" : "#666", border: "1px solid #333", fontSize: "12px", cursor: "pointer" }} />
                          </td>
                          <td style={{ padding: "14px 16px", maxWidth: "180px" }}>
                            {notes[g.name] && notes[g.name].length > 0 && (
                              <div style={{ marginBottom: "6px" }}>
                                {notes[g.name].slice(-1).map((n, ni) => (
                                  <div key={ni} style={{ fontSize: "11px", color: "#9ca3af", background: "#1f2937", padding: "4px 8px", borderRadius: "4px", marginBottom: "2px" }}>
                                    <div>{n.text}</div><div style={{ color: "#555", fontSize: "10px" }}>{n.date}</div>
                                  </div>
                                ))}
                                {notes[g.name].length > 1 && <div style={{ fontSize: "10px", color: "#555" }}>+{notes[g.name].length - 1} more</div>}
                              </div>
                            )}
                            {editingNote === g.name ? (
                              <div>
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add note..." style={{ width: "100%", padding: "6px", borderRadius: "6px", background: "#1f2937", color: "#fff", border: "1px solid #333", fontSize: "12px", resize: "vertical", minHeight: "60px" }} />
                                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                                  <button onClick={() => saveNote(g.name)} style={{ flex: 1, padding: "4px", borderRadius: "4px", background: "#166534", color: "#4ade80", border: "none", cursor: "pointer", fontSize: "11px" }}>Save</button>
                                  <button onClick={() => setEditingNote(null)} style={{ flex: 1, padding: "4px", borderRadius: "4px", background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: "11px" }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingNote(g.name); setNoteText("") }} style={{ padding: "4px 10px", borderRadius: "6px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer", fontSize: "11px" }}>Add Note</button>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                              <button onClick={() => generateResearch(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1e3a5f", color: "#60a5fa", border: "none", cursor: "pointer", fontSize: "11px" }}>📋</button>
                              <button onClick={() => generateOutreach(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#4ade80", border: "none", cursor: "pointer", fontSize: "11px" }}>✉️</button>
                              <button onClick={() => generateQuestions(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#2d1a3e", color: "#c084fc", border: "none", cursor: "pointer", fontSize: "11px" }}>❓</button>
                              <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#25d366", border: "none", cursor: "pointer", fontSize: "11px" }}>💬</button>
                              <button onClick={() => removeFromPipeline(realIndex)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#2a1a1a", color: "#f87171", border: "none", cursor: "pointer", fontSize: "11px" }}>🗑️</button>
                              <button onClick={() => toggleCompare(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: isCompared ? "#1a3a2a" : "#1a1a2e", color: isCompared ? "#4ade80" : "#a78bfa", border: "none", cursor: "pointer", fontSize: "11px" }}>{isCompared ? "✓" : "⚖️"}</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Episode Planner View */}
        {view === "planner" && (
          <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#4ade80" }}>📅 Episode Planner</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>All booked guests and recording dates in one view</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => setPlannerMonth(new Date(plannerMonth.getFullYear(), plannerMonth.getMonth() - 1, 1))} style={{ padding: "7px 12px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer" }}>← Prev</button>
                <span style={{ fontSize: "15px", fontWeight: "bold", color: "#fff", minWidth: "150px", textAlign: "center" }}>{plannerMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setPlannerMonth(new Date(plannerMonth.getFullYear(), plannerMonth.getMonth() + 1, 1))} style={{ padding: "7px 12px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer" }}>Next →</button>
                <button onClick={() => setPlannerMonth(new Date())} style={{ padding: "7px 12px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "12px" }}>Today</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              {[{ label: "Total Booked", value: pipeline.filter(g => g.status === "Booked").length, color: "#4ade80" }, { label: "Dates Set", value: pipeline.filter(g => g.status === "Booked" && g.recordingDate).length, color: "#60a5fa" }, { label: "This Month", value: pipeline.filter(g => g.status === "Booked" && g.recordingDate && new Date(g.recordingDate).getMonth() === plannerMonth.getMonth() && new Date(g.recordingDate).getFullYear() === plannerMonth.getFullYear()).length, color: "#f59e0b" }].map(s => (
                <div key={s.label} style={{ padding: "12px 18px", borderRadius: "10px", background: "#111827", border: "1px solid #1f2937", textAlign: "center", minWidth: "90px" }}>
                  <div style={{ fontSize: "22px", fontWeight: "bold", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
            {(() => {
              const year = plannerMonth.getFullYear()
              const month = plannerMonth.getMonth()
              const firstDay = new Date(year, month, 1).getDay()
              const daysInMonth = new Date(year, month + 1, 0).getDate()
              const todayStr = new Date().toISOString().split("T")[0]
              const bookedByDate = {}
              pipeline.filter(g => g.status === "Booked" && g.recordingDate).forEach(g => {
                if (!bookedByDate[g.recordingDate]) bookedByDate[g.recordingDate] = []
                bookedByDate[g.recordingDate].push(g)
              })
              const cells = []
              const startOffset = firstDay === 0 ? 6 : firstDay - 1
              for (let i = 0; i < startOffset; i++) cells.push(null)
              for (let d = 1; d <= daysInMonth; d++) cells.push(d)
              while (cells.length % 7 !== 0) cells.push(null)
              return (
                <div style={{ background: "#0d0d1a", borderRadius: "12px", border: "1px solid #1f2937", overflow: "hidden", marginBottom: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#111827", borderBottom: "1px solid #1f2937" }}>
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} style={{ padding: "8px", textAlign: "center", fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>{d}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                    {cells.map((day, idx) => {
                      if (!day) return <div key={idx} style={{ minHeight: isMobile ? "60px" : "90px", borderRight: "1px solid #1a1a2e", borderBottom: "1px solid #1a1a2e", background: "#080810" }} />
                      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                      const guestsOnDay = bookedByDate[dateStr] || []
                      const isToday = dateStr === todayStr
                      const isDouble = guestsOnDay.length > 1
                      return (
                        <div key={idx} style={{ minHeight: isMobile ? "60px" : "90px", padding: "4px", borderRight: "1px solid #1a1a2e", borderBottom: "1px solid #1a1a2e", background: isToday ? "#0d1f0d" : "#0d0d1a" }}>
                          <div style={{ fontSize: "12px", fontWeight: isToday ? "bold" : "normal", color: isToday ? "#4ade80" : "#4b5563", marginBottom: "3px", width: "20px", height: "20px", borderRadius: "50%", background: isToday ? "#14532d" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{day}</div>
                          {isDouble && <div style={{ fontSize: "8px", color: "#f87171", background: "#2a1a1a", padding: "1px 4px", borderRadius: "3px", marginBottom: "2px" }}>Double!</div>}
                          {guestsOnDay.map((g, gi) => (
                            <div key={gi} onClick={() => generateResearch(g)} title={g.name}
                              style={{ fontSize: "9px", padding: "2px 4px", borderRadius: "3px", marginBottom: "2px", background: isDouble ? "#2a1a1a" : "#1a2e1a", color: isDouble ? "#f87171" : "#4ade80", border: `1px solid ${isDouble ? "#7f1d1d" : "#166534"}`, cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: "600" }}>
                              {g.name}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
            <h3 style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "12px" }}>📋 Upcoming Recordings</h3>
            {pipeline.filter(g => g.status === "Booked" && g.recordingDate).length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "#555", fontSize: "13px", background: "#111827", borderRadius: "12px", border: "1px solid #1f2937" }}>
                No booked guests with recording dates yet.<br />
                <button onClick={() => setView("pipeline")} style={{ marginTop: "12px", padding: "8px 20px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>Go to Pipeline</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {pipeline.filter(g => g.status === "Booked" && g.recordingDate).sort((a, b) => new Date(a.recordingDate) - new Date(b.recordingDate)).map((g, i) => {
                  const rDate = new Date(g.recordingDate)
                  const isPast = rDate < new Date(new Date().toDateString())
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "10px", background: "#111827", border: `1px solid ${isPast ? "#1f2937" : "#166534"}`, opacity: isPast ? 0.6 : 1 }}>
                      <div style={{ textAlign: "center", minWidth: "50px", background: isPast ? "#1f2937" : "#14532d", padding: "8px", borderRadius: "8px" }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: isPast ? "#6b7280" : "#4ade80" }}>{rDate.getDate()}</div>
                        <div style={{ fontSize: "10px", color: isPast ? "#4b5563" : "#86efac" }}>{rDate.toLocaleDateString('en-IN', { month: 'short' })}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: isPast ? "#9ca3af" : "#fff", fontSize: "14px" }}>{g.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{g.category} • Score: {g.total} • {isPast ? "Recorded" : "Upcoming"}</div>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button onClick={() => generateResearch(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1e3a5f", color: "#60a5fa", border: "none", cursor: "pointer", fontSize: "11px" }}>📋</button>
                        <button onClick={() => generateOutreach(g)} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#4ade80", border: "none", cursor: "pointer", fontSize: "11px" }}>✉️</button>
                        <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ padding: "5px 8px", borderRadius: "6px", background: "#1a2e1a", color: "#25d366", border: "none", cursor: "pointer", fontSize: "11px" }}>💬</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Compare View */}
        {view === "compare" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#a78bfa" }}>⚖️ Guest Comparison</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Side by side — decide who to prioritize</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setView("home")} style={{ padding: "8px 16px", borderRadius: "8px", background: "#111", color: "#666", border: "1px solid #333", cursor: "pointer", fontSize: "13px" }}>← Back</button>
                <button onClick={() => { setComparedGuests([]); setView("home") }} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>Clear All</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${comparedGuests.length}, 1fr)`, gap: "14px" }}>
              {comparedGuests.map((g, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${priorityColor(g.priority)}44`, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(135deg,${priorityColor(g.priority)}22,#111827)`, padding: "18px", borderBottom: "1px solid #1f2937", textAlign: "center" }}>
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: priorityColor(g.priority), marginBottom: "4px" }}>{g.total}</div>
                    <div style={{ fontSize: "11px", color: priorityColor(g.priority), fontWeight: "bold", marginBottom: "8px" }}>{g.priority} Priority</div>
                    <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#fff" }}>{g.name}</h3>
                    <span style={{ fontSize: "12px", background: "#1e1e3f", color: "#a78bfa", padding: "3px 10px", borderRadius: "20px" }}>{g.category}</span>
                    <div style={{ marginTop: "8px" }}>
                      {g.lastAppeared === "Never" || g.lastAppeared === "First appearance"
                        ? <span style={{ fontSize: "11px", color: "#00ff88" }}>First Time</span>
                        : <span style={{ fontSize: "11px", color: "#f59e0b" }}>Repeat ({g.lastAppeared})</span>}
                    </div>
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Scores</div>
                    {[{ label: "Virality", val: g.virality }, { label: "Relevance", val: g.relevance }, { label: "Value", val: g.value }].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "12px", color: "#9ca3af", minWidth: "65px" }}>{s.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                          <div style={{ flex: 1, height: "6px", background: "#1f2937", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${s.val * 10}%`, height: "100%", background: s.val >= 8 ? "#00ff88" : s.val >= 6 ? "#ffaa00" : "#ff6666", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "bold", color: s.val >= 8 ? "#00ff88" : s.val >= 6 ? "#ffaa00" : "#ff6666", minWidth: "18px", textAlign: "right" }}>{s.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "bold", marginBottom: "6px", textTransform: "uppercase" }}>Why Now</div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>{g.whyNow}</p>
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937" }}>
                    <div style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "bold", marginBottom: "6px", textTransform: "uppercase" }}>Topic Angle</div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>{g.topicAngle}</p>
                  </div>
                  <div style={{ padding: "14px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>Status</span>
                    <span style={{ fontSize: "13px", color: statusColor(g.status), fontWeight: "bold" }}>{g.status}</span>
                  </div>
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button onClick={() => generateResearch(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>📋 Research</button>
                    <button onClick={() => generateOutreach(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "13px" }}>✉️ Outreach</button>
                    <button onClick={() => generateQuestions(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "13px" }}>❓ Questions</button>
                    <button onClick={() => { setSelectedGuest(g); generateWhatsapp(g); setView("whatsapp") }} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "13px" }}>💬 WhatsApp</button>
                    <button onClick={() => toggleCompare(g)} style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research View */}
        {view === "research" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#a78bfa" }}>📋 Research: {selectedGuest?.name}</h2>
            {loading ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating research...</div>
              : <div style={{ background: "#111827", borderRadius: "12px", padding: "24px", border: "1px solid #333", whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#d1d5db", fontSize: "14px" }}>
                {research}
                <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid #333", paddingTop: "20px" }}>
                  <button onClick={() => generateOutreach(selectedGuest)} style={{ padding: "10px 18px", borderRadius: "8px", background: "#1a2e1a", color: "#4ade80", border: "1px solid #166534", cursor: "pointer" }}>✉️ Outreach</button>
                  <button onClick={() => generateQuestions(selectedGuest)} style={{ padding: "10px 18px", borderRadius: "8px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer" }}>❓ Questions</button>
                  <button onClick={() => { setSelectedGuest(selectedGuest); generateWhatsapp(selectedGuest); setView("whatsapp") }} style={{ padding: "10px 18px", borderRadius: "8px", background: "#1a2e1a", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer" }}>💬 WhatsApp</button>
                </div>
              </div>}
          </div>
        )}

        {/* Questions View */}
        {view === "questions" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#a78bfa" }}>❓ 20 Questions: {selectedGuest?.name}</h2>
            {loading ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating questions...</div>
              : <div style={{ background: "#111827", borderRadius: "12px", padding: "24px", border: "1px solid #333", whiteSpace: "pre-wrap", lineHeight: "1.9", color: "#d1d5db", fontSize: "14px" }}>
                {questions}
                <div style={{ marginTop: "20px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                  <button onClick={() => navigator.clipboard.writeText(questions)} style={{ padding: "10px 20px", borderRadius: "8px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer" }}>📋 Copy Questions</button>
                </div>
              </div>}
          </div>
        )}

        {/* Outreach View */}
        {view === "outreach" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#a78bfa" }}>✉️ Outreach: {selectedGuest?.name}</h2>
            {loading ? <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating outreach email...</div> : (
              <div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #1e3a5f", marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#60a5fa", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📬 Recipient Email Address</label>
                  <input type="email" placeholder="Enter guest's email or management contact" value={outreach.recipientEmail} onChange={e => setOutreach(prev => ({ ...prev, recipientEmail: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: `1px solid ${outreach.recipientEmail ? "#3b82f6" : "#374151"}`, fontSize: "13px", boxSizing: "border-box", outline: "none" }} />
                  <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#4b5563" }}>Tip: Check the guest's official website or Instagram bio for management email</p>
                </div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📌 Subject Line</label>
                  <div style={{ fontSize: "14px", color: "#f3f4f6", fontWeight: "600", background: "#1f2937", padding: "10px 14px", borderRadius: "8px", border: "1px solid #374151" }}>{outreach.subject || "—"}</div>
                </div>
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>📝 Email Body</label>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#d1d5db", fontSize: "14px" }}>{outreach.body || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <button onClick={openInGmail} style={{ flex: 2, padding: "12px 20px", borderRadius: "10px", background: "linear-gradient(135deg,#1a3a1a,#14532d)", color: "#4ade80", border: "1px solid #166534", cursor: "pointer", fontSize: "14px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    📧 Open in Gmail
                    {outreach.recipientEmail ? <span style={{ fontSize: "11px", color: "#86efac" }}>{outreach.recipientEmail}</span> : <span style={{ fontSize: "11px", color: "#6b7280" }}>(add recipient above)</span>}
                  </button>
                  <button onClick={copyEmailBody} style={{ flex: 1, padding: "12px 20px", borderRadius: "10px", background: copiedEmail ? "#1a3a1a" : "#1e3a5f", color: copiedEmail ? "#4ade80" : "#60a5fa", border: `1px solid ${copiedEmail ? "#166534" : "#1e40af"}`, cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                    {copiedEmail ? "✅ Copied!" : "📋 Copy Email"}
                  </button>
                </div>
                <button onClick={() => { generateWhatsapp(selectedGuest); setView("whatsapp") }} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg,#1a2e1a,#14532d)", color: "#25d366", border: "1px solid #128c7e", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                  💬 Switch to WhatsApp Message Instead
                </button>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp View */}
        {view === "whatsapp" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <button onClick={() => setView("home")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "8px", background: "#1e1e3f", color: "#a78bfa", border: "1px solid #4c1d95", cursor: "pointer" }}>← Back</button>
            <h2 style={{ color: "#25d366" }}>💬 WhatsApp Message: {selectedGuest?.name}</h2>
            {loadingWhatsapp ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating WhatsApp message...</div>
            ) : (
              <div>
                {/* WhatsApp Chat Bubble Preview */}
                <div style={{ background: "#0d1117", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "1px solid #1f2937" }}>
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "10px" }}>Preview — how it looks in WhatsApp</div>
                  <div style={{ background: "#1a2e1a", borderRadius: "12px 12px 12px 0", padding: "14px 16px", maxWidth: "85%", border: "1px solid #166534" }}>
                    <div style={{ fontSize: "13px", color: "#dcf8c6", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{whatsappMsg || "—"}</div>
                    <div style={{ fontSize: "10px", color: "#4ade80", marginTop: "6px", textAlign: "right" }}>Raj Shamani's Team ✓✓</div>
                  </div>
                </div>

                {/* Editable textarea */}
                <div style={{ background: "#111827", borderRadius: "12px", padding: "20px", border: "1px solid #333", marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "bold", display: "block", marginBottom: "8px" }}>✏️ Edit Message (optional)</label>
                  <textarea value={whatsappMsg} onChange={e => setWhatsappMsg(e.target.value)} rows={6}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#1f2937", color: "#fff", border: "1px solid #374151", fontSize: "13px", resize: "vertical", boxSizing: "border-box", outline: "none", lineHeight: "1.6" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                    <span style={{ fontSize: "11px", color: whatsappMsg.length > 200 ? "#f87171" : "#4b5563" }}>{whatsappMsg.length} characters {whatsappMsg.length > 200 ? "(getting long for WhatsApp)" : ""}</span>
                    <button onClick={() => generateWhatsapp(selectedGuest)} style={{ padding: "5px 12px", borderRadius: "6px", background: "#1f2937", color: "#9ca3af", border: "1px solid #333", cursor: "pointer", fontSize: "12px" }}>Regenerate</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <button onClick={openInWhatsApp} style={{ flex: 2, padding: "13px 20px", borderRadius: "10px", background: "linear-gradient(135deg,#128c7e,#25d366)", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                    💬 Open in WhatsApp
                  </button>
                  <button onClick={copyWhatsApp} style={{ flex: 1, padding: "13px 20px", borderRadius: "10px", background: copiedWA ? "#1a3a2a" : "#1f2937", color: copiedWA ? "#4ade80" : "#9ca3af", border: `1px solid ${copiedWA ? "#166534" : "#333"}`, cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                    {copiedWA ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>

                <div style={{ padding: "12px 16px", borderRadius: "8px", background: "#0d1117", border: "1px solid #1f2937" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", lineHeight: "1.6" }}>
                    Click <strong style={{ color: "#25d366" }}>Open in WhatsApp</strong> → WhatsApp opens with message pre-filled → Search for the contact → Send. You can also edit the message above before sending.
                  </p>
                </div>

                <button onClick={() => { generateOutreach(selectedGuest) }} style={{ width: "100%", marginTop: "12px", padding: "12px", borderRadius: "10px", background: "#1e3a5f", color: "#60a5fa", border: "1px solid #1e40af", cursor: "pointer", fontSize: "13px" }}>
                  ✉️ Switch to Email Outreach Instead
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Competitors View */}
      {view === "competitors" && (
        <div>
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", color: "#818cf8" }}>🏆 Competitor Intelligence</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Who are Raj's competitors booking — find gaps and opportunities</p>
            </div>
            <button onClick={fetchCompetitors} disabled={loadingCompetitors} style={{ padding: "10px 20px", borderRadius: "8px", background: loadingCompetitors ? "#333" : "linear-gradient(135deg,#3730a3,#1e1b4b)", color: "#818cf8", border: "1px solid #3730a3", cursor: loadingCompetitors ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "bold" }}>
              {loadingCompetitors ? "⏳ Fetching..." : "🔄 Refresh Data"}
            </button>
          </div>

          {loadingCompetitors && (
            <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
              <p>Analyzing what competitors are doing...</p>
            </div>
          )}

          {!loadingCompetitors && competitors.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "50px", marginBottom: "16px" }}>🏆</div>
              <h3 style={{ color: "#555" }}>No data loaded yet</h3>
              <p style={{ color: "#444", fontSize: "13px" }}>Click Refresh Data to see what competitors are booking</p>
              <button onClick={fetchCompetitors} style={{ marginTop: "16px", padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg,#3730a3,#1e1b4b)", color: "#818cf8", border: "none", cursor: "pointer" }}>🏆 Load Competitor Data</button>
            </div>
          )}

          {competitors.length > 0 && (
            <div>
              {/* India vs Global tabs summary */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["India", "Global"].map(type => (
                  <div key={type} style={{ padding: "10px 20px", borderRadius: "10px", background: type === "India" ? "#1e1b4b" : "#1a0533", border: `1px solid ${type === "India" ? "#3730a3" : "#7c3aed"}`, minWidth: "120px", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: type === "India" ? "#818cf8" : "#a78bfa" }}>{competitors.filter(c => c.type === type).length}</div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{type} Competitors</div>
                  </div>
                ))}
                <div style={{ padding: "10px 20px", borderRadius: "10px", background: "#1a2e1a", border: "1px solid #166534", minWidth: "140px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80" }}>
                    {competitors.reduce((acc, c) => acc + (c.guests ? c.guests.filter(g => g.rajFit).length : 0), 0)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Gap Opportunities</div>
                </div>
              </div>

              {/* India Competitors */}
              <h3 style={{ color: "#818cf8", fontSize: "15px", marginBottom: "14px", borderBottom: "1px solid #1e1b4b", paddingBottom: "8px" }}>🇮🇳 India Competitors</h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(380px,1fr))", gap: "16px", marginBottom: "28px" }}>
                {competitors.filter(c => c.type === "India").map((comp, ci) => (
                  <div key={ci} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${comp.color}33`, overflow: "hidden" }}>
                    {/* Competitor Header */}
                    <div style={{ padding: "16px", borderBottom: "1px solid #1f2937", background: `linear-gradient(135deg,${comp.color}11,#111827)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#fff" }}>{comp.name}</h3>
                          <span style={{ fontSize: "11px", color: comp.color, background: comp.color + "22", padding: "2px 8px", borderRadius: "20px" }}>{comp.aka}</span>
                        </div>
                        <span style={{ fontSize: "10px", background: "#1e1b4b", color: "#818cf8", padding: "3px 8px", borderRadius: "6px" }}>🇮🇳 India</span>
                      </div>
                      <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#9ca3af" }}><span style={{ color: "#f59e0b" }}>Edge:</span> {comp.edge}</p>
                    </div>
                    {/* Their Recent Guests */}
                    <div style={{ padding: "14px" }}>
                      <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Recent Guests</div>
                      {comp.guests && comp.guests.length > 0 ? comp.guests.map((g, gi) => (
                        <div key={gi} style={{ background: g.rajFit ? "#0d1f0d" : "#0d0d1a", borderRadius: "8px", padding: "10px 12px", marginBottom: "8px", border: `1px solid ${g.rajFit ? "#166534" : "#1f2937"}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <div>
                              <span style={{ fontSize: "13px", fontWeight: "bold", color: g.rajFit ? "#4ade80" : "#fff" }}>{g.name}</span>
                              <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "1px 6px", borderRadius: "10px", marginLeft: "6px" }}>{g.category}</span>
                            </div>
                            {g.rajFit && <span style={{ fontSize: "10px", background: "#14532d", color: "#4ade80", padding: "2px 7px", borderRadius: "6px", whiteSpace: "nowrap" }}>Gap Opportunity</span>}
                          </div>
                          <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>{g.why}</p>
                          {g.rajFit && g.rajAngle && (
                            <div style={{ marginTop: "6px", padding: "6px 10px", background: "#1a2e1a", borderRadius: "6px", border: "1px solid #166534" }}>
                              <span style={{ fontSize: "11px", color: "#60a5fa" }}>Raj's Angle: </span>
                              <span style={{ fontSize: "11px", color: "#86efac" }}>{g.rajAngle}</span>
                            </div>
                          )}
                          {g.rajFit && (
                            <button onClick={() => addToPipeline({ name: g.name, category: g.category, whyNow: g.rajAngle || g.why, topicAngle: g.rajAngle || "", virality: 8, relevance: 8, value: 8, total: "8.0", priority: "High", status: "New", lastAppeared: "Never", isAISlot: false, addedDate: new Date().toLocaleDateString("en-IN") }, "competitor")}
                              style={{ marginTop: "6px", width: "100%", padding: "6px", borderRadius: "6px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
                              + Add to Raj's Pipeline
                            </button>
                          )}
                        </div>
                      )) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "#555", fontSize: "12px" }}>Click Refresh to load guests</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Competitors */}
              <h3 style={{ color: "#a78bfa", fontSize: "15px", marginBottom: "14px", borderBottom: "1px solid #2e1e5f", paddingBottom: "8px" }}>🌍 Global Competitors</h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(380px,1fr))", gap: "16px" }}>
                {competitors.filter(c => c.type === "Global").map((comp, ci) => (
                  <div key={ci} style={{ background: "#111827", borderRadius: "12px", border: `1px solid ${comp.color}33`, overflow: "hidden" }}>
                    <div style={{ padding: "16px", borderBottom: "1px solid #1f2937", background: `linear-gradient(135deg,${comp.color}11,#111827)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#fff" }}>{comp.name}</h3>
                          <span style={{ fontSize: "11px", color: comp.color, background: comp.color + "22", padding: "2px 8px", borderRadius: "20px" }}>{comp.aka}</span>
                        </div>
                        <span style={{ fontSize: "10px", background: "#2e1e5f", color: "#a78bfa", padding: "3px 8px", borderRadius: "6px" }}>🌍 Global</span>
                      </div>
                      <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#9ca3af" }}><span style={{ color: "#f59e0b" }}>Edge:</span> {comp.edge}</p>
                    </div>
                    <div style={{ padding: "14px" }}>
                      <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Recent Guests</div>
                      {comp.guests && comp.guests.length > 0 ? comp.guests.map((g, gi) => (
                        <div key={gi} style={{ background: g.rajFit ? "#0d1f0d" : "#0d0d1a", borderRadius: "8px", padding: "10px 12px", marginBottom: "8px", border: `1px solid ${g.rajFit ? "#166534" : "#1f2937"}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <div>
                              <span style={{ fontSize: "13px", fontWeight: "bold", color: g.rajFit ? "#4ade80" : "#fff" }}>{g.name}</span>
                              <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "1px 6px", borderRadius: "10px", marginLeft: "6px" }}>{g.category}</span>
                            </div>
                            {g.rajFit && <span style={{ fontSize: "10px", background: "#14532d", color: "#4ade80", padding: "2px 7px", borderRadius: "6px", whiteSpace: "nowrap" }}>Gap Opportunity</span>}
                          </div>
                          <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>{g.why}</p>
                          {g.rajFit && g.rajAngle && (
                            <div style={{ marginTop: "6px", padding: "6px 10px", background: "#1a2e1a", borderRadius: "6px", border: "1px solid #166534" }}>
                              <span style={{ fontSize: "11px", color: "#60a5fa" }}>Raj's Angle: </span>
                              <span style={{ fontSize: "11px", color: "#86efac" }}>{g.rajAngle}</span>
                            </div>
                          )}
                          {g.rajFit && (
                            <button onClick={() => addToPipeline({ name: g.name, category: g.category, whyNow: g.rajAngle || g.why, topicAngle: g.rajAngle || "", virality: 8, relevance: 8, value: 8, total: "8.0", priority: "High", status: "New", lastAppeared: "Never", isAISlot: false, addedDate: new Date().toLocaleDateString("en-IN") }, "competitor")}
                              style={{ marginTop: "6px", width: "100%", padding: "6px", borderRadius: "6px", background: "#1a2e3f", color: "#38bdf8", border: "1px solid #0369a1", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
                              + Add to Raj's Pipeline
                            </button>
                          )}
                        </div>
                      )) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "#555", fontSize: "12px" }}>Click Refresh to load guests</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guest History Log Overlay */}
      {historyView && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, overflowY: "auto", padding: "24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#f59e0b" }}>📜 Guest History Log</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>All guests ever suggested by AI — last 30 sessions</p>
              </div>
              <button onClick={() => setHistoryView(false)} style={{ padding: "8px 20px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>✕ Close</button>
            </div>
            {guestHistory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#555", background: "#111827", borderRadius: "12px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>📭</div>
                <p>No history yet. Generate guests to start building history.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {guestHistory.map((entry, ei) => (
                  <div key={ei} style={{ background: "#111827", borderRadius: "12px", border: "1px solid #1f2937", overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", background: "#0d0d1a", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "#f59e0b", fontWeight: "bold" }}>📅 {entry.date}</span>
                      <span style={{ fontSize: "12px", color: "#555" }}>{entry.guests.length} guests suggested</span>
                    </div>
                    <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {entry.guests.map((g, gi) => (
                        <div key={gi} style={{ background: "#1f2937", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>{g.name}</span>
                          <span style={{ fontSize: "11px", background: "#1e1e3f", color: "#a78bfa", padding: "1px 6px", borderRadius: "10px" }}>{g.category}</span>
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: g.priority === "High" ? "#00ff88" : g.priority === "Medium" ? "#ffaa00" : "#ff6666" }}>{g.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Episode Title Suggester Overlay */}
      {showTitles && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#111827", borderRadius: "16px", padding: "28px", maxWidth: "600px", width: "100%", border: "1px solid #6b21a8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#c084fc" }}>🎬 Episode Title Suggestions</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Guest: {titleGuest?.name}</p>
              </div>
              <button onClick={() => setShowTitles(false)} style={{ padding: "6px 14px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
            </div>
            {loadingTitles ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>⏳ Generating viral titles...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {titles.map((title, ti) => (
                  <div key={ti} style={{ background: "#1a0a2e", borderRadius: "10px", padding: "14px 16px", border: "1px solid #4c1d95", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "14px", color: "#e9d5ff", flex: 1, lineHeight: "1.5" }}>{title}</span>
                    <button onClick={() => { navigator.clipboard.writeText(title) }}
                      style={{ padding: "5px 12px", borderRadius: "6px", background: "#2d1a3e", color: "#c084fc", border: "1px solid #6b21a8", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" }}>
                      Copy
                    </button>
                  </div>
                ))}
                {titles.length > 0 && (
                  <button onClick={() => { navigator.clipboard.writeText(titles.join("\n")) }}
                    style={{ marginTop: "8px", padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg,#4c1d95,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>
                    📋 Copy All Titles
                  </button>
                )}
                <button onClick={() => generateTitles(titleGuest)}
                  style={{ padding: "8px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>
                  🔄 Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Interview Brief Overlay */}
      {showBrief && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, overflowY: "auto", padding: "24px" }}>
          <div style={{ background: "#111827", borderRadius: "16px", padding: "28px", maxWidth: "750px", margin: "0 auto", border: "1px solid #92400e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#fbbf24" }}>📄 Pre-Interview Brief</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>Guest: {briefGuest?.name} • For Raj's eyes only</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { navigator.clipboard.writeText(brief); setCopiedBrief(true); setTimeout(() => setCopiedBrief(false), 2000) }}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: copiedBrief ? "#1a3a2a" : "#1e3a5f", color: copiedBrief ? "#4ade80" : "#60a5fa", border: "none", cursor: "pointer", fontSize: "12px" }}>
                  {copiedBrief ? "✅ Copied!" : "📋 Copy Brief"}
                </button>
                <button onClick={() => setShowBrief(false)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "13px" }}>✕ Close</button>
              </div>
            </div>
            {loadingBrief ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>⏳ Generating pre-interview brief...</div>
            ) : (
              <div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", color: "#d1d5db", fontSize: "14px", background: "#0d1117", borderRadius: "10px", padding: "20px", border: "1px solid #1f2937", marginBottom: "16px" }}>
                  {brief}
                </div>
                <button onClick={() => generateBrief(briefGuest)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: "12px" }}>
                  🔄 Regenerate Brief
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      {comparedGuests.length > 0 && view !== "compare" && (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#1a0533,#0d1f3c)", border: "1px solid #7c3aed", borderRadius: "14px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", zIndex: 1000, boxShadow: "0 8px 32px rgba(124,58,237,0.4)", flexWrap: "wrap", justifyContent: "center", maxWidth: "90vw" }}>
          <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "bold" }}>⚖️ Comparing ({comparedGuests.length}/3):</span>
          {comparedGuests.map((g, i) => (
            <span key={i} style={{ fontSize: "12px", background: "#2e1e5f", color: "#c4b5fd", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
              {g.name}
              <span onClick={() => toggleCompare(g)} style={{ cursor: "pointer", color: "#f87171", fontWeight: "bold" }}>×</span>
            </span>
          ))}
          {comparedGuests.length >= 2 && <button onClick={() => setView("compare")} style={{ padding: "7px 16px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}>Compare Now →</button>}
          <button onClick={() => setComparedGuests([])} style={{ padding: "7px 12px", borderRadius: "10px", background: "#2a1a1a", color: "#f87171", border: "1px solid #7f1d1d", cursor: "pointer", fontSize: "12px" }}>Clear</button>
        </div>
      )}

    </div>
  )
}

export default App
