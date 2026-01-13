import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { UserRole } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  name: string;
  role: UserRole;
  phone?: string;
  address: string;
  city: string;
}

interface QuickAccount {
  role: string;
  label: string;
  email: string;
  password: string;
}


const loginSchema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, 'Mot de passe trop court').required('Mot de passe requis')
});

const registerSchema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, 'Mot de passe trop court').required('Mot de passe requis'),
  name: yup.string().required('Nom requis'),
  role: yup.string().required('Rôle requis'),
  phone: yup.string(),
  address: yup.string().required('Adresse requise'),
  city: yup.string().required('Ville requise')
});

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();

  type FormInputs = LoginFormData | RegisterFormData;

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(mode === 'login' ? loginSchema : registerSchema) as any
  });


  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'restaurant',
      label: t('role.restaurant'),
      description: 'Recherchez du personnel, des services et des fournisseurs'
    },
    {
      value: 'artisan',
      label: t('role.artisan'),
      description: 'Proposez vos services de maintenance et réparation'
    },
    {
      value: 'fournisseur',
      label: t('role.fournisseur'),
      description: 'Vendez vos produits et équipements'
    },
    {
      value: 'candidat',
      label: t('role.candidat'),
      description: 'Trouvez des opportunités d\'emploi'
    },
    {
      value: 'community_manager',
      label: t('role.community_manager'),
      description: 'Gérez la présence digitale des restaurants'
    }
  ];

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (mode === 'login') {
      try {
        await login(data.email, data.password);
        reset();
        onClose();
      } catch (error) {
        // L'erreur est déjà gérée dans le contexte d'authentification
        logger.error('Erreur lors de la connexion', error);
      }
    } else {
      // Pour l'inscription, afficher un message temporaire
      toast('Fonctionnalité d\'inscription à venir.');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'login' ? t('auth.login') : t('auth.register')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {mode === 'register' && (
          <>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('auth.choose_role')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <label key={role.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      value={role.value}
                      {...registerField('role')}
                      className="sr-only peer"
                    />
                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors peer-checked:border-orange-500 peer-checked:bg-orange-50">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {(errors as FieldErrors<RegisterFormData>).role && (
                <p className="text-sm text-red-600 mt-1">{(errors as FieldErrors<RegisterFormData>).role?.message}</p>
              )}
            </div>

            {/* Name Input */}
            <Input
              label={t('auth.name')}
              icon={<User className="h-5 w-5" />}
              {...registerField('name')}
              error={mode === 'register' ? (errors as FieldErrors<RegisterFormData>).name?.message : undefined}
              placeholder="Nom complet ou nom de l'établissement"
            />
          </>
        )}

        {/* Email Input */}
        <Input
          label={t('auth.email')}
          type="email"
          icon={<Mail className="h-5 w-5" />}
          {...registerField('email')}
          error={errors.email?.message}
          placeholder="votre@email.com"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            icon={<Lock className="h-5 w-5" />}
            {...registerField('password')}
            error={errors.password?.message}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {mode === 'register' && (
          <>
            {/* Phone Input */}
            <Input
              label={t('auth.phone')}
              type="tel"
              icon={<Phone className="h-5 w-5" />}
              {...registerField('phone')}
              error={(errors as FieldErrors<RegisterFormData>).phone?.message}
              placeholder="+33 6 12 34 56 78"
            />

            {/* Location Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Adresse"
                icon={<MapPin className="h-5 w-5" />}
                {...registerField('address')}
                error={(errors as FieldErrors<RegisterFormData>).address?.message}
                placeholder="123 Rue de la Paix"
              />
              <Input
                label="Ville"
                {...registerField('city')}
                error={(errors as FieldErrors<RegisterFormData>).city?.message}
                placeholder="Paris"
              />
            </div>
          </>
        )}

        {/* Demo Credentials */}
        {mode === 'login' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">Comptes de démonstration</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Restaurant:</strong> restaurant@demo.com / demo123</p>
              <p><strong>Artisan:</strong> artisan@demo.com / demo123</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isLoading}
        >
          {mode === 'login' ? t('auth.login') : t('auth.register')}
        </Button>

        {/* Switch Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            {mode === 'login' 
              ? "Pas encore de compte ? S'inscrire" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>
      </form>

      {/* Connexions rapides pour le mode login */}
      {mode === 'login' && (
        <div className="mt-6 space-y-4">
          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Connexions rapides */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Connexion rapide (test)</h3>
            <div className="grid grid-cols-1 gap-2">
              {([
                { role: 'restaurant', label: '🍽️ Restaurant', email: 'restaurant1@restauconnect.com', password: 'password123' },
                { role: 'driver', label: '🚗 Livreur', email: 'driver1@test.fr', password: 'password123' },
                { role: 'artisan', label: '👨‍🍳 Artisan', email: 'artisan@test.fr', password: 'password123' },
                { role: 'supplier', label: '📦 Fournisseur', email: 'fournisseur@test.fr', password: 'password123' },
                { role: 'super_admin', label: '⚙️ Admin', email: 'super_admin@test.fr', password: 'password123' },
                { role: 'carrier', label: '🚚 Transporteur', email: 'transporteur@test.fr', password: 'password123' },
                { role: 'banker', label: '🏦 Banquier', email: 'banquier@test.fr', password: 'password123' },
                { role: 'accountant', label: '📊 Comptable', email: 'comptable@test.fr', password: 'password123' }
              ] as QuickAccount[]).map((account) => (
                <button
                  key={account.role}
                  onClick={async () => {
                    try {
                      await login(account.email, account.password || 'password123');
                      onClose();
                    } catch (error) {
                      console.error('Erreur lors de la connexion rapide', error);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{account.label}</span>
                    <span className="text-sm text-gray-500">{account.email}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Astuce :</strong> Utilisez les connexions rapides pour tester l'application avec différents rôles.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export const MyComponent: React.FC = () => {
  return <motion.div animate={{ opacity: 1 }} />;
};

export default AuthModal;
