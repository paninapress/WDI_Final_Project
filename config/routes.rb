WdiFinal::Application.routes.draw do

  devise_for :users
  root to: 'site#index'  
  resources :connections do
    resources :logs
  end
  get '/dashboard', to: 'site#show'
  get '/auth/:provider/callback', to: 'connections#collect'
  put '/category/:id/:category', to: 'connection#category'
end
