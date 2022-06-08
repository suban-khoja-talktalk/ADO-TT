var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/suban-khoja-talktalk/ADO-TT.git', // Update to point to your repository  
        user: {
            name: 'Suban Khoja', // update to use your name
            email: 'subhankumar.khoja@talktalkplc.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)