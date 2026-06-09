import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'


export default function History() {

    
  const { language } =
    useContext(LanguageContext)

  const t = translations[language]



  const history = JSON.parse(
    localStorage.getItem('cropshield_history')
  ) || []

  
  const clearHistory = () => {

    localStorage.removeItem('cropshield_history')

    window.location.reload()
  }



  return (
    <div className="min-h-screen bg-green-950 text-white p-10">

      
<div className="flex items-center justify-between mb-8">

  <h1 className="text-4xl font-bold">
     {t.history}
  </h1>

  <button
    onClick={clearHistory}
    className="bg-green-900 hover:bg-green-950 px-4 py-2 rounded-lg border border-green-700"
  >
    {t.ClearHistory}
  </button>

</div>


      {history.length === 0 ? (
        <p>{t.noHistory}</p>
      ) : (
        <div className="grid gap-6">

          {history.map((item, index) => (

            <div
              key={index}
              className="bg-green-900 rounded-xl p-5 flex gap-5 items-center"
            >

              <img
                src={item.image}
                alt="Plant"
                className="w-32 h-32 object-cover rounded-lg"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  {item.disease}
                </h2>

                <p className="mt-1">
                  {t.Confidence}: {item.confidence}%
                </p>

                <p>
                  {t.Severity}: {item.severity}
                </p>

                <p className="text-sm text-white/60 mt-2">
                  {item.date}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

