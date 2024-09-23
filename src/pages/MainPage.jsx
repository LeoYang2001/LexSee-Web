import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import '../App.css'
import OpenAI from "openai";



const detailTabList = [
    {
        id:0,
        tabName:'DEFINITION'
    },
    {
        id:1,
        tabName:'SYNONYMS'
    },
   
    {
        id:2,
        tabName:'IMAGE'
    }
]

function MainPage({user, signOut}) {


    const wordApiUrl = process.env.REACT_APP_WORDS_API_URL;
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    
    const openai = new OpenAI(
        {
            apiKey: OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
          }
    );

    //search, typing, detail
    const [viewMode, setViewMode] = useState('search')
    const [word, setWord] = useState('')
    const [wordsSuggestions, setWordsSuggestions] = useState([])
    const [ifFetchingSuggestions, setIfFetchingSuggestions] = useState(false)
    const [detailTabId, setDetailTabId] = useState(0)
    const [wordDetailInfo, setWordDetailInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [imagesResults, setImagesResults] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); 
    const [currentImages, setCurrentImages] = useState([]);

    //HANDLE Pagination
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentImagesSlice = imagesResults.slice(indexOfFirstItem, indexOfLastItem);
        
        setCurrentImages(currentImagesSlice);
    }, [imagesResults, currentPage, itemsPerPage]);

    const returnExample = {"word":"demo","results":[{"definition":"give an exhibition of to an interested audience","partOfSpeech":"verb","synonyms":["demonstrate","exhibit","present","show"],"typeOf":["show"],"hasTypes":["bring home"],"examples":["We will demo the new software in Washington"]},{"definition":"a visual presentation showing how something works","partOfSpeech":"noun","synonyms":["demonstration"],"typeOf":["visual communication"],"hasTypes":["exemplification","expression","illustration","manifestation","reflection","reflexion","show","display"],"examples":["the lecture was accompanied by dramatic demonstrations","the lecturer shot off a pistol as a demonstration of the startle response"]}],"syllables":{"count":2,"list":["dem","o"]},"pronunciation":{"all":"'dɛmoʊ"},"frequency":3.7}




    useEffect(() => {
       if(word.trim().length > 0)
       {
        fetchWordsSuggestions()
       }
    }, [word])


    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab key action
            if(wordsSuggestions.length > 0)
            {
                setWord(wordsSuggestions[0].word)
            }
        }
        else if (e.key === 'Enter') {
            handleSearchWord()
        }
    };

    const handleSaveWord = (wordDetailInfo, imgUrl)=>{
        console.log(`wordDetailInfo: ${wordDetailInfo}, imgUrl : ${imgUrl}`)
    }

   const handleInput = (e) => {
        let newVal = e.target.value
        setWord(newVal)

        if(newVal.length > 0)
        {
            setViewMode('typing')
        }
        else{
            setViewMode('search')
        }

   }

   const handleSearchImage = async (urlWord) => {
    try {
        const apiKey = '8373e03e0067b60c26b44b27fd691f5d311507ad2b344d3943873335bdee7511';
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `https://serpapi.com/search.json?engine=google_images&q=${urlWord}&api_key=${apiKey}`;
        
        const response = await fetch(proxyUrl + targetUrl);
        const data = await response.json();
        if(data?.images_results)
        {
            setImagesResults(data?.images_results)
        }

        
    } catch (error) {
        console.log(error);
    }
}

useEffect(() => {
    setCurrentPage(1)
}, [imagesResults])


   const handleSearchWord = async (searchWord) => {
        let urlWord = searchWord ? searchWord : word;
        setImagesResults([])
        setDetailTabId(0)
        setViewMode('detail')
        setWord(urlWord)
        setIsLoading(true)
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { "role": "system", "content": "You are a English teacher." },
                    {
                        "role": "user",
                        "content": `define word ${urlWord}  
                        .  return me in this format ${JSON.stringify(returnExample)},
                        `
                    },
                ],
                model: "gpt-4o-mini",
            });
    
            const response = completion.choices[0].message.content;

            setWordDetailInfo(JSON.parse(response))
            handleSearchImage(urlWord)
        setIsLoading(false)

        } catch (error) {
            console.error('Error in handleAISearch:', error);

            return [];  
        }
        
     
   }

   const fetchWordsSuggestions = async () => {
    setIfFetchingSuggestions(true)
    try {
      const response = await fetch(`${wordApiUrl}?sp=${word}*`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const data_filtered = data.filter(item => item.word.split(' ').length < 2)
      setWordsSuggestions(data_filtered.slice(0,20))
        setIfFetchingSuggestions(false)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    
    }
  };
  

  return (
    <div className=' flex-1 flex-col  '>
        <section className={` bg-black flex-col upperArea ${viewMode}  `}>
            {
                viewMode === 'search' && (
                    <header className='flex   py-6 px-10  justify-between items-center'>
                        <span className='text-white  font-semibold'>{user.username}</span>
                        <h1 style={{
                            fontFamily:'Pacifico'
                        }} className=' text-xl  font-semibold text-white'>Lexi</h1>
                        <button onClick={signOut} className=' flex items-center justify-center gap-2'>
                        <span className=' text-white  font-semibold '>log out</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                            </svg>
                        </button>
                    </header>
                )
            }
            <section className={`flex-1 flex-col h-full  flex justify-center  items-center     w-full`}>
                <div className=' opacity-0 mt-6'>demo</div>
                <div style={{ width:'50%'}} className=' flex-row   relative'>
                    {
                        (wordsSuggestions.length > 0 && word && !ifFetchingSuggestions) && (viewMode === 'typing') && (
                            <div  style={{ zIndex: 1 }} className=' text-3xl text-gray-500 py-2  pl-4 absolute' >
                             {word}{wordsSuggestions[0]?.word.slice(word.length, wordsSuggestions[0]?.word.length)}
                        </div>
                        )
                    }
                    <input
                    style={{ position: 'relative', zIndex: 2 }}
                    value={word}
                    onChange={handleInput}  
                    onKeyDown={handleKeyDown}
                    
                    className=' text-3xl text-white py-2  pl-4  pr-16 border-b-2 w-full border-r-gray-500   outline-none bg-transparent'
                    placeholder='What would you like to search?' />
                        <button  onClick={()=>{
                            setWord('')
                            setViewMode('search')
                        }} style={{width:40, height:40, top:'calc(50% - 20px)', right:16, zIndex:5}} className=' flex justify-center items-center  absolute '>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </button>
                </div>
                {
                    viewMode === 'typing' && (
                        <section style={{
                            height:'80%',
                            width:' 50%'
                        }}
                            className=' text-white  text-3xl  px-4   custom-scrollbar'
                        >
                            {
                                wordsSuggestions.map(item => (
                                    <div onClick={()=>{
                                        handleSearchWord(item.word)
                                    }} className=' wordSuggestionItem mt-4 ' key={item.word} >
                                        {item.word}
                                    </div>
                                ))
                            }
                        </section>
                    )
                }
                 {
                viewMode === 'detail' && (
                    <section style={{ width:'50%', height:'30%'}} className='  flex flex-row gap-10  mt-auto '>
                        {
                            detailTabList.map(tabItem => (
                                <div
                                onClick={()=>{
                                    setDetailTabId(tabItem.id)
                                }}
                                key={tabItem.id}
                                className={` text-white flex justify-center items-center  font-semibold  cursor-pointer h-full ${tabItem.id === detailTabId ? 'highlightedTab' : 'detailTab'} `}>
                                    {tabItem.tabName}
                                </div>
                            ))
                        }
                        
                    </section>
                )
            }
            </section>
           
        </section>

        {
            viewMode === 'detail' &&  !isLoading ? (
                <main style={{ height:'80vh', width:' 100%'}} className=' w-full  flex justify-center  pt-10 px-14   '>
                    
                   <div
                    style={{width:'70%'}}
                   >
                    <div style={{
                        fontFamily:'monospace'
                    }} className=' text-5xl font-bold my-4 flex items-end gap-4'>
                        {
                            wordDetailInfo?.word
                        }
                        <span className=' text-sm text-gray-400 font-thin '>
                            /{
                                wordDetailInfo?.pronunciation?.all
                            }/
                        </span>
                    </div>
                    {
                    wordDetailInfo?.results && (detailTabId === 0) && !isLoading && (
                       <>
                            {
                                wordDetailInfo?.results.map((definitionItem,index) => (
                                    <div key={definitionItem.partOfSpeech}>
                                        <span className=' font-bold'>{definitionItem.partOfSpeech}</span>
                                                <div className=' flex flex-col  my-2  '>
                                                <h3 style={{
                                                    fontFamily:'cursive'
                                                }}> {definitionItem.definition}</h3>
                                               {
                                                definitionItem?.examples && (
                                                    <>
                                                    {
                                                        definitionItem.examples.map((exp, index) => (
                                                            <span  style={{
                                                                fontFamily:'monospace'
                                                            }} className=' text-gray-400 my-1  ml-6'>{index+1}. {exp}</span>
                                                        ))
                                                       }
                                                    </>
                                                ) 
                                               }
                                            </div>
                                          
                                    </div>
                                    
                                ))
                            }
                          
                       </>
                    )
                   }

                    {
                    wordDetailInfo?.results && (detailTabId === 1) && !isLoading && (
                       <>
                            {
                                wordDetailInfo?.results.map((definitionItem,index) => (
                                    <div key={definitionItem.partOfSpeech}>
                                        <span className=' font-bold'>{definitionItem.partOfSpeech}</span>
                                                <div className=' flex flex-col  my-2'>
                                                <h3  className=" text-gray-400 " style={{
                                                    fontFamily:'monospace'
                                                }}> {definitionItem.examples}</h3>
                                                {
                                                definitionItem?.synonyms && (
                                                    <div className='flex flex-col mt-4'>
                                                        <span className='font-bold text-sm'>Synonyms:</span>
                                                        {
                                                            definitionItem.synonyms.map((synonym, index) => (
                                                                <span onClick={()=>{
                                                                    
                                                                    handleSearchWord(synonym)
                                                                }} key={index} style={{ fontFamily: 'serif' }} className='text-gray-400 my-1 cursor-pointer hoverItem'>
                                                                    {index + 1}. {synonym}
                                                                </span>
                                                            ))
                                                        }
                                    </div>
                                )
                            }
                                            </div>
                                          
                                    </div>
                                    
                                ))
                            }
                          
                       </>
                    )
                   }

{
    wordDetailInfo?.results && (detailTabId === 2) && !isLoading && (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {
                    currentImages.map((image, index) => (
                        <div onClick={()=>{
                            handleSaveWord(wordDetailInfo, image.thumbnail)
                        }} key={index} className="border rounded-lg overflow-hidden cursor-pointer hoverItem">
                                <img 
                                    src={image.thumbnail} 
                                    alt={image.title} 
                                    className="w-full h-48 object-cover"
                                />
                            <div className="p-2">
                                <h3 className="font-bold text-sm">{image.title}</h3>
                                <p className="text-gray-500 text-xs">{image.source}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={(currentPage * itemsPerPage) >= imagesResults.length}
                    className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </>
    )
}
                   
                   
                   

                    </div>
                    
                </main>
            ):(
              <>
               {
                viewMode === 'detail' && (
                    <div
                    className=' pt-10  flex justify-center '
                   >
                        LOADING....
                    </div>
                )
               }
              </>
            )
        }
      
        {
            viewMode === 'search' && (
                <main className=' relative  w-full   '>
                    {/* CARD BOX  */}
                    <div style={{width:'100vw', height:'40vh'}} className='   relative  '>
                        {/* CARD  */}
                        <div style={{width:'70%',height:'calc(40vh + 40px)', top:-40, left:'calc(15%)'}} className='absolute bg-white '>
                            {viewMode}
                        </div>
                    </div>
                </main>
            )
        }
      
    </div>
  )
}

export default MainPage