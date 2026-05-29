import { useState, useEffect, useCallback } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./AuthContext"

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

function App() {
  const { user, logout } = useAuth()
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
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [guestHistory, setGuestHistory] = useState([])
  const [historyView, setHistoryView] = useState(false)
  const [titles, setTitles] = useState([])
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [titleGuest, setTitleGuest] = useState(null)
  const [showTitles, setShowTitles] = useState(false)
  const [brief, setBrief] = useState("")
  const [loadingBrief, setLoadingBrief] = useState(false)
  const [briefGuest, setBriefGuest] = useState(null)
  const [showBrief, setShowBrief] = useState(false)
  const [copiedBrief, setCopiedBrief] = useState(false)
  const [alignmentData, setAlignmentData] = useState({})
  const [loadingAlignment, setLoadingAlignment] = useState(null)
  const [globalSearch, setGlobalSearch] = useState("")
  const [globalSearchResult, setGlobalSearchResult] = useState(null)
  const [loadingGlobalSearch, setLoadingGlobalSearch] = useState(false)
  const [plannerMonth, setPlannerMonth] = useState(new Date())
  const [comparedGuests, setComparedGuests] = useState([])
  const [trends, setTrends] = useState([])
  const [loadingTrends, setLoadingTrends] = useState(false)
  const [trendGuests, setTrendGuests] = useState({})
  const [loadingTrendGuest, setLoadingTrendGuest] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [competitors, setCompetitors] = useState([])
  const [loadingCompetitors, setLoadingCompetitors] = useState(false)
  const [syncStatus, setSyncStatus] = useState("")

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const shouldIncludeVaibhav = () => {
    const lastVaibhav = localStorage.getItem("raj_vaibhav_last")
    if (!lastVaibhav) return true
    const diffDays = Math.floor((new Date() - new Date(lastVaibhav)) / (1000 * 60 * 60 * 24))
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

  const savePipelineToSupabase = async (pipelineData) => {
    try {
      setSyncStatus("Syncing...")
      await supabase.from('pipeline').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (pipelineData.length > 0) {
        await supabase.from('pipeline').insert(pipelineData.map(g => ({
          name: g.name, category: g.category, score: g.total, priority: g.priority,
          status: g.status || 'New', virality: g.virality, relevance: g.relevance, value: g.value,
          why_now: g.whyNow, topic_angle: g.topicAngle, last_appeared: g.lastAppeared,
          recording_date: g.recordingDate || '', added_date: g.addedDate,
          pipeline_date: g.pipelineDate, added_from: g.addedFrom, is_ai_slot: g.isAISlot || false
        })))
      }
      setSyncStatus("Synced ✓")
      setTimeout(() => setSyncStatus(""), 2000)
    } catch (e) { setSyncStatus("Sync failed"); console.error("Supabase pipeline save error:", e) }
  }

  const loadPipelineFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('pipeline').select('*').order('created_at', { ascending: true })
      if (error) throw error
      if (data && data.length > 0) {
        const mapped = data.map(g => ({
          name: g.name, category: g.category, total: g.score, priority: g.priority,
          status: g.status, virality: g.virality, relevance: g.relevance, value: g.value,
          whyNow: g.why_now, topicAngle: g.topic_angle, lastAppeared: g.last_appeared,
          recordingDate: g.recording_date, addedDate: g.added_date,
          pipelineDate: g.pipeline_date, addedFrom: g.added_from, isAISlot: g.is_ai_slot
        }))
        setPipeline(mapped)
        localStorage.setItem("raj_pipeline", JSON.stringify(mapped))
      } else {
        const saved = localStorage.getItem("raj_pipeline")
        if (saved) { const parsed = JSON.parse(saved); setPipeline(parsed); if (parsed.length > 0) await savePipelineToSupabase(parsed) }
      }
    } catch (e) {
      console.error("Supabase pipeline load error:", e)
      const saved = localStorage.getItem("raj_pipeline")
      if (saved) setPipeline(JSON.parse(saved))
    }
  }

  const saveNotesToSupabase = async (guestName, notesList) => {
    try {
      await supabase.from('notes').delete().eq('guest_name', guestName)
      if (notesList && notesList.length > 0) {
        await supabase.from('notes').insert(notesList.map(n => ({ guest_name: guestName, note_text: n.text, created_at: n.date })))
      }
    } catch (e) { console.error("Supabase notes save error:", e) }
  }

  const loadNotesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('notes').select('*')
      if (error) throw error
      if (data && data.length > 0) {
        const notesObj = {}
        data.forEach(n => {
          if (!notesObj[n.guest_name]) notesObj[n.guest_name] = []
          notesObj[n.guest_name].push({ text: n.note_text, date: n.created_at })
        })
        setNotes(notesObj)
        localStorage.setItem("raj_notes", JSON.stringify(notesObj))
      } else {
        const saved = localStorage.getItem("raj_notes")
        if (saved) setNotes(JSON.parse(saved))
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_notes")
      if (saved) setNotes(JSON.parse(saved))
    }
  }

  const saveGuestHistoryToSupabase = async (entry) => {
    try { await supabase.from('guest_history').insert({ session_date: entry.date, guests: entry.guests }) }
    catch (e) { console.error("Supabase history save error:", e) }
  }

  const loadGuestHistoryFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('guest_history').select('*').order('created_at', { ascending: false }).limit(30)
      if (error) throw error
      if (data && data.length > 0) {
        const history = data.map(h => ({ date: h.session_date, guests: h.guests }))
        setGuestHistory(history)
        localStorage.setItem("raj_guest_history", JSON.stringify(history))
      } else {
        const saved = localStorage.getItem("raj_guest_history")
        if (saved) setGuestHistory(JSON.parse(saved))
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_guest_history")
      if (saved) setGuestHistory(JSON.parse(saved))
    }
  }

  const saveRecentGuestsToSupabase = async (names) => {
    try {
      await supabase.from('recent_guests').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (names.length > 0) await supabase.from('recent_guests').insert(names.map(name => ({ name })))
    } catch (e) { console.error("Supabase recent guests save error:", e) }
  }

  const loadRecentGuestsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('recent_guests').select('*').order('added_at', { ascending: false }).limit(225)
      if (error) throw error
      if (data && data.length > 0) {
        const names = data.map(g => g.name)
        localStorage.setItem("raj_recent_guests", JSON.stringify(names))
        return names
      } else {
        const saved = localStorage.getItem("raj_recent_guests")
        return saved ? JSON.parse(saved) : []
      }
    } catch (e) {
      const saved = localStorage.getItem("raj_recent_guests")
      return saved ? JSON.parse(saved) : []
    }
  }

  const generateGuests = useCallback(async (keyOverride) => {
    const useKey = keyOverride || apiKey
    if (!useKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoading(true); setView("home"); setActiveCategory("all")
    const recentGuests = await loadRecentGuestsFromSupabase()
    const includeVaibhav = shouldIncludeVaibhav()
    const today = new Date()
    const vaibhavRule = includeVaibhav
      ? `VAIBHAV SISINTY: Include him as AI Tools expert. Topic: Latest AI tools for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.`
      : `VAIBHAV SISINTY: Do NOT include him (appeared less than 15 days ago).`
    try {
      const text = await callOpenAI(`You are a podcast guest strategist for "Figuring Out With Raj Shamani" - India's top podcast 500+ episodes. Audience: young Indians 18-35.
PAST GUESTS (avoid completely): ${PAST_GUESTS}
SHOWN IN LAST 15 DAYS (STRICTLY avoid): ${recentGuests.join(", ")}
${vaibhavRule}
PRIORITY GAPS: Virat Kohli, Rohit Sharma, Hardik Pandya, Sachin Tendulkar, Deepika Padukone, Priyanka Chopra, Shah Rukh Khan, Rahul Gandhi, Sundar Pichai, PV Sindhu, Neeraj Chopra
Suggest EXACTLY 15 guests for ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.
Return JSON array EXACTLY 15 items each with: name, category, whyNow, topicAngle, virality(1-10), relevance(1-10), value(1-10), lastAppeared("Never" or year), repeatReason, isAISlot(true only for Vaibhav)
ONLY valid JSON. EXACTLY 15 ITEMS. NO MARKDOWN.`, useKey)
      const withScores = parseGuests(text, 15)
      if (includeVaibhav) localStorage.setItem("raj_vaibhav_last", new Date().toISOString())
      const newRecentGuests = [...withScores.map(g => g.name), ...recentGuests].slice(0, 225)
      localStorage.setItem("raj_recent_guests", JSON.stringify(newRecentGuests))
      await saveRecentGuestsToSupabase(newRecentGuests)
      const now = new Date().toLocaleString('en-IN')
      setGuests(withScores); setLastUpdated(now)
      const historyEntry = { date: now, guests: withScores.map(g => ({ name: g.name, category: g.category, total: g.total, priority: g.priority })) }
      await saveGuestHistoryToSupabase(historyEntry)
      await loadGuestHistoryFromSupabase()
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
    const recentGuests = await loadRecentGuestsFromSupabase()
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

  const fetchTrends = async () => {
    if (!apiKey) { alert("Please enter your OpenAI API key first!"); return }
    setLoadingTrends(true); setTrends([]); setTrendGuests({})
    try {
      const text = await callOpenAI(`You are a news analyst for India. Today is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
List the TOP 8 trending topics in India RIGHT NOW across: politics, cricket, Bollywood, business, sports, social issues, technology, entertainment.
Return ONLY valid JSON array of 8 items: { "topic": "", "headline": "", "category": "", "heat": 1-10 }
ONLY valid JSON. NO MARKDOWN.`)
      const cleaned = text.replace(/```json|```/g, "").trim()
      setTrends(JSON.parse(cleaned))
    } catch (e) { alert("Error fetching trends: " + e.message) }
    setLoadingTrends(false)
  }

  const findGuestForTrend 
