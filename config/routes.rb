WdiFinal::Application.routes.draw do

  root to: 'site#index'
  resources :site
  get '/auth/:provider/callback', to: 'site#omniauth'

end
