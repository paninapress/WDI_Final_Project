WdiFinal::Application.routes.draw do

  devise_for :users
  root to: 'site#index'
  
  get '/dashboard', to: 'site#show'
  get '/auth/:provider/callback', to: 'site#omniauth'

end
