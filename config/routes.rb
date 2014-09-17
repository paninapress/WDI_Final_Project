WdiFinal::Application.routes.draw do

  devise_for :users
  root to: 'site#index'  
  resources :connections do
    resources :logs
  end

  get '/dashboard', to: 'site#show'
  get '/callback', to: 'connections#collect'
  get '/auth/:provider/callback', to: 'connections#collect'
  put '/category/:id/:category', to: 'connection#category'
  get 'groups', to: 'groups#index'
end
